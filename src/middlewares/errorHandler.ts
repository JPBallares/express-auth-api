import { NextFunction, Request, Response } from 'express';
import { MongoError } from 'mongodb';

// Error handling middleware
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof MongoError && err.code === 11000) {
    // Duplicate key error
        return res.status(400).json({ message: 'Duplicate key error' });
    }

    // Handle other errors
    return res.status(500).json({ message: 'Internal server error' });
}

export default errorHandler;
