import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@hh-bookstore/common";
import { OrderCreatedListener } from "../order-created-listener";
import { natsClient } from "../../../connections/nats-client";
import { Book } from "../../../models/book";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsClient.client);

    // Create and save a book
    const book = Book.build({
        title: "concert",
        price: 99,
        userId: "asdf"
    });
    await book.save();

    // Create the fake data event
    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 1,
        status: OrderStatus.Created,
        userId: "alskdfj",
        expiresAt: "alskdjf",
        book: {
            id: book.id,
            price: book.price
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, book, data, msg };
};

describe("order created listener", () => {
    it("sets the userId of the book", async () => {
        const { listener, book, data, msg } = await setup();

        await listener.onMessage(data, msg);

        const updatedBook = await Book.findById(book.id);

        expect(updatedBook!.orderId).toEqual(data.id);
    });

    it("acks the message", async () => {
        const { listener, data, msg } = await setup();
        await listener.onMessage(data, msg);

        expect(msg.ack).toHaveBeenCalled();
    });
});
