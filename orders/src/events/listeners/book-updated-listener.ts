import { BookUpdatedEvent, Listener, Subjects } from "@hh-bookstore/common";
import { Message } from "node-nats-streaming";
import config from "config";
import { Book } from "../../models/book";

export class BookUpdatedListener extends Listener<BookUpdatedEvent> {
    subject: Subjects.BookUpdated = Subjects.BookUpdated;
    queueGroupName: string = config.get("natsConfig.queueGroupName");

    async onMessage(data: BookUpdatedEvent["data"], msg: Message): Promise<void> {
        const book = await Book.findByIdAndPreviousVersion(data);

        if (!book) {
            throw new Error("Book not found");
        }

        const { title, price, version } = data;
        await book.set({
            title,
            price,
            version,
        });

        await book.save();
        msg.ack();
    }
}