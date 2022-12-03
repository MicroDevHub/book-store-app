import "reflect-metadata";
import express, { Express } from "express";
import { json } from "body-parser";
import swaggerUi from "swagger-ui-express";
import cookieSession from "cookie-session";
import { Container } from "inversify";
import {
    errorHandler,
    NotFoundError,
    currentUser,
    ILogger
} from "@hh-bookstore/common";
import * as fs from "fs";
import config from "config";

import { INatsConnection } from "./connections/nats-connection";
import { IMongodbConnection } from "./connections/mongodb-connection";
import { createPaymentRouter } from "./routes/create";

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
            this.logger.info(`Payments service is listening on port ${this.port}!`);
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
        this.server.use(createPaymentRouter);
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

