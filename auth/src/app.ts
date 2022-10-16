import express, { Express } from "express";
import { Container } from "inversify";
import { json } from "body-parser";
import swaggerUi from "swagger-ui-express";
import cookieSession from "cookie-session";
import {
    errorHandler,
    NotFoundError,
    ILogger
} from "@hh-bookstore/common";
import config from "config";
import fs from "fs";

import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { currentuserRouter } from "./routes/current-user";
import { IMongodbConnection } from "./connections/mongodb-connection";

export class App {
    private readonly serviceContract: any;
    private readonly mongodbConnection: IMongodbConnection;
    private readonly port: number;
    public server: Express;
    public logger: ILogger;

    constructor(private container: Container) {
        this.serviceContract = JSON.parse(fs.readFileSync("./contract/contract.json", "utf8"));
        this.mongodbConnection = this.container.get<IMongodbConnection>("IMongodbConnection");
        this.logger = this.container.get<ILogger>("ILogger");
        this.server = express();
        this.port = config.get("port");
    }

    public async start() {
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

        this.server.use(currentuserRouter);
        this.server.use(signinRouter);
        this.server.use(signupRouter);
        this.server.use(signoutRouter);

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



