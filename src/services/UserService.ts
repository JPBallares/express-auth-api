import bcrypt from 'bcrypt';

import BaseError from '../exceptions/BaseError';
import User, { IUser } from '../models/User';

const SALT = 12;

export const createUser = async (user: IUser) => {
    try {
        const hash = await bcrypt.hash(user.password, SALT);
        const newUser = new User({
            ...user,
            password: hash,
        });
        newUser.save();
        return newUser;
    } catch (e: any) {
        throw new BaseError('EncryptionError', 500, true, e.message);
    }
};
