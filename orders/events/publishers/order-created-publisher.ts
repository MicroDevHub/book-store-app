import {OrderCreatedEvent, Publisher, Subjects} from "@hh-bookstore/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}