import mongoose from 'mongoose';
import config from 'config';

export class MongodbConnection {

    mongodb: any;

    constructor() {
    }

    public async startConnect() {
        try {
            this.mongodb = mongoose;
            await this.mongodb.connect(config.get('mongoUrl'));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
