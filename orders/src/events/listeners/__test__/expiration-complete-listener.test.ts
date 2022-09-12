import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsClient } from "../../../connections/nats-client";
import { ExpirationCompleteEvent, OrderStatus } from "@hh-bookstore/common";
import mongoose from "mongoose";
import { Book } from "../../../models/book";
import { Order } from "../../../models/order";
import { Message } from "node-nats-streaming";
jest.setTimeout(50000);

const setup = async () => {
    // create an instance of the listener
    const listener = new ExpirationCompleteListener(natsClient.client);

    const book = Book.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "tram nam khong quen",
        price: 20
    });

    await book.save();
    const order = Order.build({
        status: OrderStatus.Created,
        userId: "test123",
        expiresAt: new Date(),
        book,
    });
    await order.save();

    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return { listener, order, book, data, msg };
};

describe("Expiration complete listener", () => {
    it("emit an OrderCancelled event", async () => {
        const { listener, order, data, msg } = await setup();

        // call the onMessage function with the data object + message object
        await listener.onMessage(data, msg);
        expect(natsClient.client.publish).toHaveBeenCalled();

        const eventData = JSON.parse((natsClient.client.publish as jest.Mock).mock.calls[0][1]);

        expect(eventData!.id).toEqual(order.id);
    });

    it("Updates the order status to cancelled", async () => {
        const { listener, order, data, msg } = await setup();

        // call the onMessage function with the data object + message object
        await listener.onMessage(data, msg);

        // write assertions to make sure a book was created
        const updatedOrder = await Order.findById(order.id);

        expect(updatedOrder).toBeDefined();
        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    });

    it("acks the message", async () => {
        const { listener, data, msg } = await setup();

        // call the onMessage function with the data object + message object
        await listener.onMessage(data, msg);

        // write assertions to make sure ack function is called
        expect(msg.ack).toHaveBeenCalled();
    });
});

