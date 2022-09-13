import { Message } from "node-nats-streaming";
import { Listener, LoggerFactory, OrderCreatedEvent, Subjects } from "@hh-bookstore/common";
import config from "config";
import { expirationQueue } from "../../queues/expiration-queue";
const logger = new LoggerFactory().logger;

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = config.get("natsConfig.queueGroupName");

    async onMessage (data: OrderCreatedEvent["data"], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        logger.info("Waiting this many milliseconds to process the job: ", delay);
        await expirationQueue.add({
            orderId: data.id
        }, {
            delay
        });

        // ack the message
        msg.ack();
    }
}
