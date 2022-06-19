import express from "express";
import { json } from "body-parser";
import swaggerUi from "swagger-ui-express";
import cookieSession from "cookie-session";
import { createOrderRouter } from "./routes/create";
import { indexOrderRouter } from "./routes/index";
import { getOrderRouter } from "./routes/get";
import { deleteOrderRouter } from "./routes/delete";

import {
    errorHandler,
    NotFoundError,
    currentUser
} from "@hh-bookstore/common";

/* eslint-disable @typescript-eslint/no-var-requires */
const swaggerDocument = require("../contract/contract.json");

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: false
    })
);

app.use(currentUser);
app.use(createOrderRouter);
app.use(indexOrderRouter);
app.use(getOrderRouter);
app.use(deleteOrderRouter);

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument));

app.all("*",  () => {
    throw new NotFoundError();
});
app.use(errorHandler);

export { app };


