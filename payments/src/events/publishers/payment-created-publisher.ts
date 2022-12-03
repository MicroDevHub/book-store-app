import { PaymentCreatedEvent, Publisher, Subjects } from "@hh-bookstore/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}