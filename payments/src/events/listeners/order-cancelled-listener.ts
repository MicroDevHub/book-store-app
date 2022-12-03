import { Message } from "node-nats-streaming";
import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@hh-bookstore/common";
import config from "config";

import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = config.get("natsConfig.queueGroupName");

    async onMessage (data: OrderCancelledEvent["data"], msg: Message) {
        const order = await Order.findByIdAndPreviousVersion({
            id: data.id,
            version: data.version
        });

        if (!order) {
            throw new Error("Order not found");
        }

        order.set({ status: OrderStatus.Cancelled });
        // Save the book
        await order.save();
        // ack the message
        msg.ack();
    }
}
