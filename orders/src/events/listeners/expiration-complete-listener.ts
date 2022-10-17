import {
    ExpirationCompleteEvent,
    Listener,
    Subjects,
    OrderStatus
} from "@hh-bookstore/common";
import { Message } from "node-nats-streaming";
import config from "config";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName: string = config.get("natsConfig.queueGroupName");

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message): Promise<void> {
        const order = await Order.findById(data.orderId).populate("book");
        if (!order) {
            throw new Error("Order not found");
        }

        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({
            status: OrderStatus.Cancelled,
        });

        await order.save();
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            book: {
                id: order.book.id
            }
        });
        msg.ack();
    }
}