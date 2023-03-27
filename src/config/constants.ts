import dotenv from 'dotenv';

dotenv.config();

// Express Config
export const PORT = process.env.PORT || 3000;
export const API_PATH = '/api/v1';

// Retrieve the MongoDB connection string from environment variables
export const DB_SCHEME = process.env.DB_SCHEME || 'mongodb';
export const DB_URL = process.env.DB_URL || 'localhost';
export const DB_NAME = process.env.DB_NAME || 'dev';
export const DB_USER = process.env.DB_USER || '';
export const DB_PASS = process.env.DB_PASS || '';
export const CONNECTION_STRING = `${DB_SCHEME}://${DB_USER}:${DB_PASS}@${DB_URL}/?retryWrites=true&w=majority`;

// Encryption
export const SALT = 12;
// Authentication
export const JWT_SECRET = process.env.JWT_SECRET || '';