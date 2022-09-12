import { natsClient } from "../../../connections/nats-client";
import { BookUpdatedEvent } from "@hh-bookstore/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Book } from "../../../models/book";
import { BookUpdatedListener } from "../book-updated-listener";
jest.setTimeout(1000000);

const setup = async () => {
    // create an instance of the listener
    const listener = new BookUpdatedListener(natsClient.client);

    // create and save a book
    const book = Book.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "test",
        price: 123
    });
    await book.save();

    // create a fake data event
    const data: BookUpdatedEvent["data"] = {
        id: book.id,
        version: book.version + 1,
        title: "new test",
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 456
    };

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    // return al of this stuff
    return { listener, data, book, msg };
}

describe("Book updated listener", () => {
    it("Find, updates, and saves a book", async () => {
        const { listener, data, book, msg } = await setup();

        // call the onMessage function with the data object + message object
        await listener.onMessage(data, msg);

        // write assertions to make sure a book was created
        const updatedBook = await Book.findById(book.id);

        expect(updatedBook!.title).toEqual(data.title);
        expect(updatedBook!.price).toEqual(data.price);
        expect(updatedBook!.version).toEqual(data.version);
    })

    it("acks the message", async () => {
        const { listener, data, msg } = await setup();

        // call the onMessage function with the data object + message object
        await listener.onMessage(data, msg);

        // write assertions to make sure ack function is called
        expect(msg.ack).toHaveBeenCalled();
    })

    it("does not call ack if the event has a skipped version number", async () => {
        const { listener, data, msg, book } = await setup();
        data.version = 10;

        try {
            // call the onMessage function with the data object + message object
            await listener.onMessage(data, msg);
        } catch (err) {}

        // write assertions to make sure ack function is called
        expect(msg.ack).not.toHaveBeenCalled();
    })
})