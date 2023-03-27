import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Retrieve the MongoDB connection string from environment variables
const dbScheme = process.env.DB_SCHEME || 'mongodb';
const dbUrl = process.env.DB_URL || 'localhost';
const dbName = process.env.DB_NAME || 'dev';
const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';
const connectionString = `${dbScheme}://${dbUser}:${dbPass}@${dbUrl}/?retryWrites=true&w=majority`;

// Create a new Mongoose connection to the MongoDB instance
mongoose.connect(connectionString, { dbName });

// Get the default connection
export default mongoose.connection;
