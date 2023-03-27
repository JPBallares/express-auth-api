import express, { Request, Response } from 'express';

import { IUser } from '../models/User';
import { createUser } from '../services/UserService';

const userRoute = express.Router();

userRoute.post('/', async (req: Request, res: Response) => {
    try {
        const {email, password}: IUser = req.body;
        const user = await createUser({
            email,
            password,
        } as IUser);
        res.status(201).send(user);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default userRoute;
