import { NextFunction, Request, Response } from 'express';
import { MongoError } from 'mongodb';

// Error handling middleware
const  errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof MongoError && err.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ message: 'Duplicate key error' });
    }

    // Handle other errors
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
    console.log(fn.constructor.name);
    if (fn.constructor.name === 'AsyncFunction') return asyncWrapper(fn);
    return fn;
};

export default errorHandler;
