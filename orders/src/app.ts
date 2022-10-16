import express, { Express } from "express";
import { json } from "body-parser";
import swaggerUi from "swagger-ui-express";
import cookieSession from "cookie-session";
import {
    errorHandler,
    NotFoundError,
    currentUser,
    ILogger
} from "@hh-bookstore/common";
import { Container } from "inversify";
import * as fs from "fs";
import config from "config";

import { createOrderRouter } from "./routes/create";
import { indexOrderRouter } from "./routes/index";
import { getOrderRouter } from "./routes/get";
import { deleteOrderRouter } from "./routes/delete";
import { IMongodbConnection } from "./connections/mongodb-connection";
import { INatsConnection } from "./connections/nats-connection";

export class App {
    private readonly serviceContract: any;
    private readonly mongodbConnection: IMongodbConnection;
    private readonly natsConnection: INatsConnection;
    private readonly port: number;
    public server: Express;
    public logger: ILogger;

    constructor(private container: Container) {
        this.serviceContract = JSON.parse(fs.readFileSync("./contract/contract.json", "utf8"));
        this.mongodbConnection = this.container.get<IMongodbConnection>("IMongodbConnection");
        this.natsConnection = this.container.get<INatsConnection>("INatsConnection");
        this.logger = this.container.get<ILogger>("ILogger");
        this.server = express();
        this.port = config.get("port");
    }

    public async start() {
        // initial connection for Nats server
        await this.natsConnection.startConnect();
        // initial connection for mongodb
        await this.mongodbConnection.startConnect();

        this.initialMiddleware();
        this.server.listen(this.port, () => {
            this.logger.info(`Orders service is listening on port ${this.port}!`);
        });
    }

    public initialMiddleware() {
        this.server.set("trust proxy", true);
        this.server.use(json());
        this.server.use(
            cookieSession({
                signed: false,
                secure: false
            })
        );

        this.server.use(currentUser);
        this.server.use(createOrderRouter);
        this.server.use(indexOrderRouter);
        this.server.use(getOrderRouter);
        this.server.use(deleteOrderRouter);

        this.server.use(
            "/docs",
            swaggerUi.serve,
            swaggerUi.setup(this.serviceContract));

        this.server.all("*",  () => {
            throw new NotFoundError();
        });
        this.server.use(errorHandler);
    }
}

