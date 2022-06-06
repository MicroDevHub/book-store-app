import config from "config";

import { NatsConnection } from "./connections/nats-connection";
import { MongodbConnection } from "./connections/mongodb-connection";
import { app } from "./app";

const start = async () => {
    try {
    // initial connection for Nats server
        const natsConnection = new NatsConnection();
        await natsConnection.startConnect();

        // initial connection for mongodb
        const mongodbConnection = new MongodbConnection();
        await mongodbConnection.startConnect();

        app.listen(config.get("port"), () => {
            console.log(`Books service is listening on port ${config.get("port")}!`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();
