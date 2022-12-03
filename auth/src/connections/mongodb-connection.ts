import mongoose from "mongoose";
import { inject, injectable } from "inversify";
import { ILogger, ILoggerFactory } from "@hh-bookstore/common";
import config from "config";

export interface IMongodbConnection {
    startConnect(): Promise<void>;
}

@injectable()
export class MongodbConnection implements IMongodbConnection {
    mongodb: mongoose.Mongoose | undefined;
    private logger: ILogger;

    constructor(
        @inject("ILoggerFactory") loggerFactory: ILoggerFactory,
    ) {
        this.logger = loggerFactory(MongodbConnection.name).logger;
    }

    public async startConnect () {
        try {
            this.mongodb = mongoose;
            this.logger.info("MongoDB connection starting...!", {
                operation: "MongodbConnection.startConnect",
                parameters: {
                    mongoUrl: config.get("mongoUrl")
                }
            });
            await this.mongodb.connect(config.get("mongoUrl"));
            this.logger.info("MongoDB connected successfully !");
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
