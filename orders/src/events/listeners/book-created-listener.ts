import { BookCreatedEvent, Listener, Subjects } from "@hh-bookstore/common";
import { Message } from "node-nats-streaming";
import config from "config";
import { Book } from "../../models/book";

export class BookCreatedListener extends Listener<BookCreatedEvent> {
    subject: Subjects.BookCreated = Subjects.BookCreated;
    queueGroupName: string = config.get("natsConfig.queueGroupName");

    async onMessage(data: BookCreatedEvent["data"], msg: Message): Promise<void> {
        const { id, title, price } = data;
        const book = Book.build({
            id,
            title,
            price,
        });
        await book.save();
        msg.ack();
    }
}