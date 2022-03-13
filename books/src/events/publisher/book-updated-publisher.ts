import { BookUpdatedEvent, Publisher, Subjects } from '@hh-bookstore/common';

export class BookUpdatedPublisher extends Publisher<BookUpdatedEvent> {
    readonly subject = Subjects.BookUpdated;
}