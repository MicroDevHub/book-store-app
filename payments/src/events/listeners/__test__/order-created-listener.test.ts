import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@hh-bookstore/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsClient } from "../../../connections/nats-client";
import { Order } from "../../../models/order";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsClient.client);

    // Create the fake data event
    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 1,
        status: OrderStatus.Created,
        userId: "alskdfj",
        expiresAt: "alskdjf",
        book: {
            id: "alskdfj",
            price: 123
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

describe("order created listener", () => {
    it("replicates the order info", async () => {
        const { listener, data, msg } = await setup();
        await listener.onMessage(data, msg);
        const order = await Order.findById(data.id);

        expect(order!.price).toEqual(data.book.price);
    });

    it("acks the message", async () => {
        const { listener, data, msg } = await setup();
        await listener.onMessage(data, msg);

        expect(msg.ack).toHaveBeenCalled();
    });
});
