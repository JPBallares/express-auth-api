import { NextFunction, Request, Response } from 'express';

import Unauthorized from '../exceptions/Unauthorized';
import { getUserFromToken } from '../services/authService';

// add this middleware to routes to block access to unauthorized users
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        throw new Unauthorized('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await getUserFromToken(token);

    req.body.user = user;
    next();

};

export default authMiddleware;
