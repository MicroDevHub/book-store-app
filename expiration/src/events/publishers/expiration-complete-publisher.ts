import { ExpirationCompleteEvent, Publisher, Subjects } from "@hh-bookstore/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
s