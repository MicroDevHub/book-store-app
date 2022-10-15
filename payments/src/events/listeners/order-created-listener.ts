import { Message } from "node-nats-streaming";
import config from "config";
import { Listener, OrderCreatedEvent, Subjects } from "@hh-bookstore/common";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = config.get("natsConfig.queueGroupName");

    async onMessage (data: OrderCreatedEvent["data"], msg: Message) {
        const order = await Order.build({
            id: data.id,
            userId: data.userId,
            price: data.book.price,
            version: data.version,
            status: data.status
        });

        // Save the order
        await order.save();

        // ack the message
        msg.ack();
    }
}
