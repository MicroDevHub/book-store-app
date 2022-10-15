import mongoose from "mongoose";
import config from "config";
import { injectable } from "inversify";

export interface IMongodbConnection {
    startConnect(): Promise<void>;
}

@injectable()
export class MongodbConnection implements IMongodbConnection {

    mongodb: mongoose.Mongoose | undefined;
    private logger: any;

    constructor() {
    // TODO
    }

    public async startConnect() {
        try {
            this.mongodb = mongoose;
            await this.mongodb.connect(config.get("mongoUrl"));
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
