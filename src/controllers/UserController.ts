import express, { NextFunction, Request, Response } from 'express';

import { errorHandlerWrapper } from '../middlewares/errorHandler';
import { IUser } from '../models/User';
import { createUser, getAllUsers } from '../services/UserService';

const userRoute = express.Router();

userRoute.get('/', errorHandlerWrapper(async (req:Request, res: Response, next: NextFunction) => {
    const users = await getAllUsers();
    res.status(200).send(users);
}));

userRoute.post('/', errorHandlerWrapper(async (req: Request, res: Response,  next: NextFunction) => {
    const { email, password }: IUser = req.body;
    const user = await createUser({
        email,
        password,
    } as IUser);
    res.status(201).send(user);
}));

export default userRoute;
