import express, { NextFunction, Request, Response } from 'express';

import authHandler from '../middlewares/authHandler';
import { errorHandlerWrapper } from '../middlewares/errorHandler';
import { IUser } from '../models/User';
import { generateToken, createUser, getAllUsers } from '../services/UserService';

const userRoute = express.Router();

userRoute.get('/', errorHandlerWrapper(authHandler), errorHandlerWrapper(async (req:Request, res: Response, next: NextFunction) => {
    const users = await getAllUsers();
    res.status(200).send(users);
}));

userRoute.post('/', errorHandlerWrapper(async (req: Request, res: Response,  next: NextFunction) => {
    const param: IUser = req.body;
    const user = await createUser(param);
    res.status(201).send(user);
}));

userRoute.post('/tokens', errorHandlerWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const param: IUser = req.body;
    const token = await generateToken(param);
    res.status(200).send({ token });
}));

export default userRoute;
