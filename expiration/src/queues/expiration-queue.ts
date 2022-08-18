import Queue from "bull";
import config from "config";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsClient } from "../connections/nats-client";

interface Payload {
     orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
    redis: {
        host: config.get("redisServer.host")
    }
});

expirationQueue.process(async (job) => {
    await new ExpirationCompletePublisher(natsClient.client).publish({
        orderId: job.data.orderId,
    });
});

export {
    expirationQueue
};
