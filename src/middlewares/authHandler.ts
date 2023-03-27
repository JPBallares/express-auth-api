import { NextFunction, Request, Response } from 'express';

import Unauthorized from '../exceptions/Unauthorized';
import { verifyToken } from '../services/UserService';

// add this middleware to routes to block access to unauthorized users
const authHandler = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        throw new Unauthorized('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await verifyToken(token);

    console.log(token);

    req.body.user = user;
    next();

};

export default authHandler;
