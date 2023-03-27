import bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

import NotFound from '../exceptions/NotFound';
import Unauthorized from '../exceptions/Unauthorized';
import User, { IUser } from '../models/User';

const SALT = 12;
const JWT_SECRET = process.env.JWT_SECRET || '';

export const getAllUsers = async () => {
    return await User.find().select(['email']);
};

export const createUser = async (user: IUser) => {
    const hash = await bcrypt.hash(user.password, SALT);
    const newUser = new User({
        ...user,
        password: hash,
    });
    await newUser.save();
    return newUser;
};

export const generateToken = async (authUser: IUser) => {
    const user = await User.findOne({ email: authUser.email });
    if (!user) {
        throw new NotFound('User does not exist');
    }
    if (!(await bcrypt.compare(authUser.password, user.password))) {
        throw new Unauthorized('Invalid credentials');
    }
    const token = sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    return token;
};

export const verifyToken = async (token?: string) => {
    if (!token) {
        throw new Unauthorized('Authentication token missing');
    }
    const decoded = verify(token , JWT_SECRET) as {
        id: string
        exp: number
    };
    if (!decoded) {
        throw new Unauthorized('Invalid access token');
    }
    if (Date.now() / 1000 > decoded.exp) {
        throw new Unauthorized('Access token expired');
    }
    
    const user = await User.findById(decoded.id);
    if (!user) {
        throw new NotFound('User is not found');
    }

    return user;
};
