import express from 'express';

import database from './database';
import userRoute from './controllers/userController';
import errorHandler from './middlewares/errorHandler';
import { API_PATH, PORT } from './config/constants';
import authRoute from './controllers/authController';
import { registerTasks } from './tasks';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${API_PATH}/users`, userRoute);
app.use(`${API_PATH}/auth`, authRoute);

app.use(errorHandler);

database.on('error', console.error.bind(console, 'MongoDB connection error:'));

database.once('open', () => {
    registerTasks();
    app.listen(PORT, () => {
        console.log(`Server listening to port ${PORT}`);
    });
});
