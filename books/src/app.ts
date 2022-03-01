import express from 'express';
import { json } from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cookieSession from 'cookie-session';

import {
    errorHandler,
    NotFoundError
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

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument));

app.all('*',  (req, res) => {
    throw new NotFoundError();
});
app.use(errorHandler);

export { app };


