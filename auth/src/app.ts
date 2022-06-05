import express from 'express';
import { json } from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cookieSession from 'cookie-session';

import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';
import { currentuserRouter } from './routes/current-user';
import {
    errorHandler,
    NotFoundError
} from '@hh-bookstore/common';

/* eslint-disable */
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

app.use(currentuserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument));

app.all('*',  () => {
    throw new NotFoundError();
});
app.use(errorHandler);

export { app };


