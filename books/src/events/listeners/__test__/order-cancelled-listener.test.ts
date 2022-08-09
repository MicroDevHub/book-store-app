import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCancelledEvent } from "@hh-bookstore/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsClient } from "../../../connections/nats-client";
import { Book } from "../../../models/book";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsClient.client);
    const orderId = new mongoose.Types.ObjectId().toHexString();

    // Create and save a book
    const book = Book.build({
        title: "concert",
        price: 99,
        userId: "asdf"
    });
    await book.save();

    // Create the fake data event
    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 1,
        book: {
            id: book.id
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, book, data, msg };
};

describe("order cancelled listener", () => {
    it("Update the book, publishes an event", async () => {
        const { listener, data, book, msg } = await setup();
        await listener.onMessage(data, msg);

        const updatedBook = await Book.findById(book.id);
        expect(updatedBook!.orderId).not.toBeDefined();
        expect(natsClient.client.publish).toHaveBeenCalled();
    });

    it("acks the message", async () => {
        const { listener, data, msg } = await setup();
        await listener.onMessage(data, msg);

        expect(msg.ack).toHaveBeenCalled();
    });
});
