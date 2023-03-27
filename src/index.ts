import express from 'express';
import dotenv from 'dotenv';

import database from './database';
import userRoute from './controllers/UserController';

dotenv.config();

const port = process.env.PORT || 3000;
const apiPath = '/api/v1';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${apiPath}/users`, userRoute);

database.on('error', console.error.bind(console, 'MongoDB connection error:'));

database.once('open', () => {
    app.listen(port, () => {
        console.log(`Server listening to port ${port}`);
    });
});
