import "reflect-metadata";
import mongoose from "mongoose";
import config from "config";
import { inject, injectable } from "inversify";
import { ILogger } from "@hh-bookstore/common";

export interface IMongodbConnection {
    startConnect(): Promise<void>;
}

@injectable()
export class MongodbConnection implements IMongodbConnection {
    mongodb: mongoose.Mongoose | undefined;
    private logger: ILogger;

    constructor(
        @inject("ILogger") logger: ILogger,
    ) {
        this.logger = logger;
    }

    public async startConnect() {
        try {
            this.mongodb = mongoose;
            this.logger.info("MongoDB connection starting...!", {
                operation: "MongodbConnection.startConnect",
                parameters: {
                    mongoUrl: config.get("mongoUrl")
                }
            });
            await this.mongodb.connect(config.get("mongoUrl"));
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
