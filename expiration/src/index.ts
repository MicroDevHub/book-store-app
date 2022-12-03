import { NatsConnection } from "./connections/nats-connection";
import { LoggerFactory } from "@hh-bookstore/common";
const logger = new LoggerFactory().logger;

const start = async () => {
    try {
        // initial connection for Nats server
        const natsConnection = new NatsConnection();
        await natsConnection.startConnect();
    } catch (err) {
        logger.error(err);
    }
};

start();
