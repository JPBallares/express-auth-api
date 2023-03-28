import express, { NextFunction, Request, Response } from 'express';

import { IUserCreateRequest } from '../interfaces';
import authMiddleware from '../middlewares/authMiddleware';
import { errorHandlerWrapper } from '../middlewares/errorHandler';
import { IUser } from '../models/User';
import { createUser, getAllUsers, getUser } from '../services/userService';

const userRoute = express.Router();

userRoute.get('/', errorHandlerWrapper(authMiddleware), errorHandlerWrapper(async (req:Request, res: Response, next: NextFunction) => {
    const users = await getAllUsers();
    res.status(200).send(users);
}));

userRoute.post('/', errorHandlerWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const param: IUserCreateRequest = req.body;
    const user = await createUser(param as IUser);
    res.status(201).send(user);
}));

userRoute.get('/:id', errorHandlerWrapper(authMiddleware), errorHandlerWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    if (userId === 'me') {
        return res.send(req.body.user);
    }
    
    res.send(await getUser(userId));
}));

export default userRoute;
