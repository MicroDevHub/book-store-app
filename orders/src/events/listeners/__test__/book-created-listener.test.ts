import { BookCreatedListener } from "../book-created-listener";
import { natsClient } from "../../../connections/nats-client";
import { BookCreatedEvent } from "@hh-bookstore/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Book } from "../../../models/book";
jest.setTimeout(50000);

const setup = async () => {
    // create an instance of the listener
    const listener = new BookCreatedListener(natsClient.client);
    // create a fake data event
    const data: BookCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: "test",
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 123
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

describe("Book created listener", () => {

    it("Creates and saves a book", async () => {
        const { listener, data, msg } = await setup();

        // call the onMessage function with the data object + message object
        await listener.onMessage(data, msg);

        // write assertions to make sure a book was created
        const book = await Book.findById(data.id);

        expect(book).toBeDefined();
        expect(book!.title).toEqual(data.title);
        expect(book!.price).toEqual(data.price);
    });

    it("acks the message", async () => {
        const { listener, data, msg } = await setup();

        // call the onMessage function with the data object + message object
        await listener.onMessage(data, msg);

        // write assertions to make sure ack function is called
        expect(msg.ack).toHaveBeenCalled();
    });
});