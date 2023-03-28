import express, { Request, Response, NextFunction } from 'express';

import { ITokenRefreshRequest, ITokenRequest } from '../interfaces';
import { errorHandlerWrapper } from '../middlewares/errorHandler';
import { IUser } from '../models/User';
import { generateToken, refreshAccessToken } from '../services/authService';

const authRoute = express.Router();

authRoute.post('/tokens', errorHandlerWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const param: ITokenRequest = req.body;
    const tokens = await generateToken(param as IUser);
    res.send(tokens);
}));

authRoute.post('/tokens/refresh', errorHandlerWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const { token }: ITokenRefreshRequest = req.body;
    const tokens = await refreshAccessToken(token);
    res.send(tokens);
}));

export default authRoute;
