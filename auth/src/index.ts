import mongoose from 'mongoose';
import config from 'config';

import { app } from './app';

const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUrl'));
        console.log('Connected to MongoDb', config.get('mongoUrl'));
        app.listen(config.get('port'), () => {
            console.log(`Auth service is listening on port ${config.get('port')}!`);
        });
    } catch (err) {
        console.log(err);
    }

};

start();
