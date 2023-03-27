import express, { NextFunction, Request, Response } from 'express';

import authMiddleware from '../middlewares/authMiddleware';
import { errorHandlerWrapper } from '../middlewares/errorHandler';
import { IUser } from '../models/User';
import { generateToken, createUser, getAllUsers, getUser } from '../services/UserService';

const userRoute = express.Router();

userRoute.get('/', errorHandlerWrapper(authMiddleware), errorHandlerWrapper(async (req:Request, res: Response, next: NextFunction) => {
    const users = await getAllUsers();
    res.status(200).send(users);
}));

userRoute.post('/', errorHandlerWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const param: IUser = req.body;
    const user = await createUser(param);
    res.status(201).send(user);
}));

userRoute.get('/:id', errorHandlerWrapper(authMiddleware), errorHandlerWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    if (userId === 'me') {
        return res.send(req.body.user);
    }
    
    res.send(await getUser(userId));
}));

userRoute.post('/tokens', errorHandlerWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const param: IUser = req.body;
    const token = await generateToken(param);
    res.status(200).send({ token });
}));

export default userRoute;
