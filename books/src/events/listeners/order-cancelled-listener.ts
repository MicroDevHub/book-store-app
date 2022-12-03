import { Message } from "node-nats-streaming";
import { Listener, OrderCancelledEvent, Subjects } from "@hh-bookstore/common";

import { Book } from "../../models/book";
import config from "config";
import { BookUpdatedPublisher } from "../publisher/book-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = config.get("natsConfig.queueGroupName");

    async onMessage (data: OrderCancelledEvent["data"], msg: Message) {
        // Find the book that the order reserved
        const book = await Book.findById(data.book.id);

        // If no book, throw error
        if (!book) {
            throw new Error("Book not found");
        }

        // Mark the book as being reserved by setting its orderId property
        book.set({
            orderId: undefined
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
