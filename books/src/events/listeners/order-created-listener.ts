import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@hh-bookstore/common";
import config from "config";

import { Book } from "../../models/book";
import { BookUpdatedPublisher } from "../publisher/book-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = config.get("natsConfig.queueGroupName");

    async onMessage (data: OrderCreatedEvent["data"], msg: Message) {
        // Find the book that the order is reserving
        const book = await Book.findOne({ id: data.book.id });

        // If no book, throw error
        if (!book) {
            throw new Error("Book not found");
        }

        // Mark the book as being reserved by setting its orderId property
        book.set({
            orderId: data.id
        });

        // Save the book
        await book.save();
        await new BookUpdatedPublisher(this.client).publish({
            id: book.id,
            price: book.price,
            title: book.title,
            userId: book.userId,
            orderId: book.orderId,
            version: book.version
        });

        // ack the message
        msg.ack();
    }
}
