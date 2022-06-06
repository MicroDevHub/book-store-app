import { BookCreatedEvent, Publisher, Subjects } from "@hh-bookstore/common";

export class BookCreatedPublisher extends Publisher<BookCreatedEvent> {
    readonly subject = Subjects.BookCreated;
}
