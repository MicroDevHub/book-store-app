import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@hh-bookstore/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsClient } from "../../../connections/nats-client";
import { Order } from "../../../models/order";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsClient.client);
    const orderId = new mongoose.Types.ObjectId().toHexString();

    // Create and save a book
    const order = Order.build({
        id: orderId,
        status: OrderStatus.Created,
        price: 10,
        userId: "123213",
        version: 0
    });
    await order.save();

    // Create the fake data event
    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 1,
        book: {
            id: "1123213"
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, order, data, msg };
};

describe("order cancelled listener", () => {
    it("Update the status of the order", async () => {
        const { listener, data, order, msg } = await setup();
        await listener.onMessage(data, msg);

        const updatedOrder= await Order.findById(order.id);
        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    });

    it("acks the message", async () => {
        const { listener, data, msg } = await setup();
        await listener.onMessage(data, msg);

        expect(msg.ack).toHaveBeenCalled();
    });
});
