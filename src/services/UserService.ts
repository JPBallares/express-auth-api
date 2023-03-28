import bcrypt from 'bcrypt';

import { SALT } from '../config/constants';
import User, { IUser } from '../models/User';

export const getAllUsers = async () => {
    return await User.find().select('-password');
};

export const getUser = async (userId: string) => {
    return await User.findById(userId).select('-password');
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
