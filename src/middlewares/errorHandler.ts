import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { MongoError } from 'mongodb';

import BaseError from '../exceptions/BaseError';

// Error handling middleware
const  errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof MongoError && err.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ message: 'Duplicate key error' });
    }

    if (err instanceof JsonWebTokenError) {
        return res.status(401).json({ message: err.message });
    }

    if (err instanceof BaseError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    // Handle other errors
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
};

// Wrapper for express functions to allow bypassing the next function
const asyncWrapper = (fn: any) => {
    return function (req: Request, res: Response, next: NextFunction) {
        fn(req, res, next).catch(next);
    };
};
  
// This will automatically handle the error without calling next
export const errorHandlerWrapper = (fn: any) => {
    if (fn.constructor.name === 'AsyncFunction') return asyncWrapper(fn);
    return fn;
};

export default errorHandler;
