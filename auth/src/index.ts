import mongoose from 'mongoose';
import config from 'config';
import { Logger } from '@hh-bookstore/common';
import { app } from './app';

const logger = new Logger().logger;

const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUrl'));
        logger.info(`Connected to MongoDb ${config.get('mongoUrl')}`);
        app.listen(config.get('port'), () => {
            console.log(`Auth service is listening on port ${config.get('port')}!`);
        });
    } catch (err) {
        logger.error(err);
    }

};

start();
