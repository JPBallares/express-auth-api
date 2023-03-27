import mongoose from 'mongoose';

import { CONNECTION_STRING, DB_NAME } from '../config/constants';

// Create a new Mongoose connection to the MongoDB instance
mongoose.connect(CONNECTION_STRING, { dbName: DB_NAME });

// Get the default connection
export default mongoose.connection;
