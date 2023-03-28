import bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

import { JWT_SECRET, REFRESH_SECRET } from '../config/constants';
import BadRequest from '../exceptions/BadRequest';
import NotFound from '../exceptions/NotFound';
import Unauthorized from '../exceptions/Unauthorized';
import RefreshToken from '../models/RefreshToken';
import User, { IUser } from '../models/User';

/**
 * Checks for User object if it has correct credentials then,
 * generate access and refresh token using JWT signing
 * @param authUser User object to include in JWT
 * @returns access and refresh token pair
 */
export const generateToken = async (authUser: IUser) => {
    const user = await User.findOne({ email: authUser.email });
    if (!user) {
        throw new NotFound('User does not exist');
    }
    if (!(await bcrypt.compare(authUser.password, user.password))) {
        throw new Unauthorized('Invalid credentials');
    }
    const accessToken = sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

    await RefreshToken.create({ token: refreshToken, user: user });
    return { accessToken, refreshToken };
};

/**
 * Revoke the existing refresh token then,
 * generate new access and refresh token pair
 * and record it to database
 * @param refreshToken Refresh token used for new access token
 */
export const refreshAccessToken = async (refreshToken: string) => {
    verifyToken(refreshToken, true);

    const refreshData = await RefreshToken.findOne({ token: refreshToken });

    if (!refreshData) {
        throw new BadRequest('Invalid refresh token');
    }

    // if refresh token is already used
    // this means the refresh token has been leaked
    // in this case delete all refresh token for this user
    // to reset the authentication flow and prevent malicious auth
    if (refreshData.revoked) {
        await RefreshToken.find({ user: refreshData.user }).deleteMany();
        throw new BadRequest('Invalid refresh token');
    }

    const accessToken = sign({ id: refreshData.user }, JWT_SECRET, { expiresIn: '1h' });
    const newRefresh = sign({ id: refreshData.user }, REFRESH_SECRET, { expiresIn: '7d' });
    
    await RefreshToken.create({ token: newRefresh, user: refreshData.user });
    refreshData.revoked = true;
    refreshData.save();
    return { accessToken, refreshToken: newRefresh };
};

/**
 * Will throw an exception if token is not valid or expired
 * @param token JWT token to check for expiry
 */
export const verifyToken = (token?: string, isRefreshToken = false) => {
    if (!token) {
        throw new Unauthorized('Authentication token missing');
    }
    const decoded = verify(token, isRefreshToken? REFRESH_SECRET : JWT_SECRET) as {
        id: string
        exp: number
    };
    if (!decoded) {
        throw new Unauthorized('Invalid access token');
    }

    // Date.now() returns in milliseconds while decoded.exp is in seconds
    // need to convert the milliseconds to seconds
    if (Date.now() / 1000 > decoded.exp) {
        throw new Unauthorized('Access token expired');
    }

    return decoded;
};

/**
 * Get user from database by parsing the JWT token
 * @param token JWT token containing user info
 * @returns User object
 */
export const getUserFromToken = async (token?: string) => {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
        throw new NotFound('User is not found');
    }

    return user;
};

/**
 * Remove revoked tokens 3 days ago from the database
 */
export const cleanExpiredTokens = async () => {
    // might be better if this runs as background task
    await RefreshToken.find({
        revoked: true, 
        updatedTime: {
            $lt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
    }).deleteMany();
};
