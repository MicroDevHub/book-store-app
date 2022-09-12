import { Container } from "inversify";
import "reflect-metadata";
import { IConfig } from "config";
import * as config from "config";
import { LoggerFactory, ILogger } from "@hh-bookstore/common";
import { IMongodbConnection, MongodbConnection } from "./connections/mongodb-connection";

export const configure = (container: Container): void => {
    container.bind<IConfig>("IConfig").toConstantValue(config);
    container.bind<Container>(Container).toConstantValue(container);
    container.bind<LoggerFactory>("LoggerFactory").toDynamicValue(() => new LoggerFactory());
    container.bind<ILogger>("ILogger").toConstantValue(
        container.get<LoggerFactory>("LoggerFactory").logger
    );

    // DB Connections
    container.bind<IMongodbConnection>("IMongodbConnection").to(MongodbConnection).inSingletonScope();
};
