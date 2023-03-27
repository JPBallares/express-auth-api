import express, { NextFunction, Request, Response } from 'express';

import { IUser } from '../models/User';
import { createUser, getAllUsers } from '../services/UserService';

const userRoute = express.Router();

userRoute.get('/', async (req:Request, res: Response, next: NextFunction) => {
    try {
        const users = await getAllUsers();
        res.status(200).send(users);
    } catch (e) {
        next(e);
    }
});

userRoute.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password}: IUser = req.body;
        const user = await createUser({
            email,
            password,
        } as IUser);
        res.status(201).send(user);
    } catch (e) {
        next(e);
    }
});


export default userRoute;
