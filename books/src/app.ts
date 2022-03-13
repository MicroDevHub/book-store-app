import express from 'express';
import { json } from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cookieSession from 'cookie-session';
import { createBookRouter } from './routes/create';
import { indexBookRouter } from './routes/index';
import { getBookRouter } from './routes/get';
import { updateBookRouter } from './routes/update';

import {
    errorHandler,
    NotFoundError,
    currentUser
} from '@hh-bookstore/common';
const swaggerDocument = require('../contract/contract.json');

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: false
    })
);

app.use(currentUser);
app.use(createBookRouter);
app.use(indexBookRouter);
app.use(getBookRouter);
app.use(updateBookRouter);

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument));

app.all('*',  (req, res) => {
    throw new NotFoundError();
});
app.use(errorHandler);

export { app };


