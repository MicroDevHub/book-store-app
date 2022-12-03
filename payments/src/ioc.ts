import { Container } from "inversify";
import "reflect-metadata";
import { IConfig } from "config";
import * as config from "config";
import { LoggerFactory, ILoggerFactory, ILogger } from "@hh-bookstore/common";

import { IMongodbConnection, MongodbConnection } from "./connections/mongodb-connection";
import { INatsConnection, NatsConnection } from "./connections/nats-connection";

export const configure = (container: Container): void => {
    container.bind<Container>(Container).toConstantValue(container);
    container.bind<IConfig>("IConfig").toConstantValue(config);
    container.bind<ILoggerFactory>("ILoggerFactory").toFactory(() =>
        (labelService: string) =>
            new LoggerFactory({ labelService })
    );
    container.bind<ILogger>("ILogger").toDynamicValue(
        () => container.get<ILoggerFactory>("ILoggerFactory")("Payment").logger
    );

    // container.bind<LoggerFactory>("LoggerFactory").toDynamicValue((context) => {
    //     console.log(context)
    //     return new LoggerFactory({
    //         // labelService: config.labelService ?? "Payments"
    //     })
    // });
    // container.bind<ILogger>("ILogger").toConstantValue(
    //     container.get<LoggerFactory>("LoggerFactory").logger
    // );

    // DB Connections
    container.bind<IMongodbConnection>("IMongodbConnection").to(MongodbConnection).inSingletonScope();
    container.bind<INatsConnection>("INatsConnection").to(NatsConnection).inSingletonScope();
};
