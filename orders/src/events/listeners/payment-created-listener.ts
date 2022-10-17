import { PaymentCreatedEvent, Listener, Subjects, OrderStatus } from "@hh-bookstore/common";
import { Message } from "node-nats-streaming";
import config from "config";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName: string = config.get("natsConfig.queueGroupName");

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message): Promise<void> {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error("Order not found");
        }

        order.set({
            status: OrderStatus.Complete
        });
        await order.save();

        msg.ack();
    }
}