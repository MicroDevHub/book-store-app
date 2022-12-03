import { Container, interfaces } from "inversify";
import "reflect-metadata";
import { IConfig } from "config";
import * as config from "config";
import { LoggerFactory, ILoggerFactory, ILogger } from "@hh-bookstore/common";

import { IMongodbConnection, MongodbConnection } from "./connections/mongodb-connection";
import { INatsConnection, NatsConnection } from "./connections/nats-connection";

export const configure = (container: Container): void => {
    container.bind<IConfig>("IConfig").toConstantValue(config);
    container.bind<Container>(Container).toConstantValue(container);
    container.bind<ILoggerFactory>("ILoggerFactory").toFactory(() =>
        (labelService: string) =>
            new LoggerFactory({ labelService })
    );
    container.bind<ILogger>("ILogger").toDynamicValue(
        () => container.get<ILoggerFactory>("ILoggerFactory")("Book").logger
    );
    container.bind<string>('loggerDynamic').toDynamicValue((context: interfaces.Context) => {
        const name = context.container.get('name') as string;
        return name;
    }).inRequestScope();
    // DB Connections
    container.bind<IMongodbConnection>("IMongodbConnection").to(MongodbConnection).inSingletonScope();
    container.bind<INatsConnection>("INatsConnection").to(NatsConnection).inSingletonScope();
};
