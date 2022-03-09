import { Publish } from "./base-publisher";
import { BookCreatedEvent } from "./book-created-event";
import { Subjects } from "./subjects";

export class BookCreatedPublisher extends Publish<BookCreatedEvent> {
    subject: Subjects.BookCreated = Subjects.BookCreated;
}