import { OrderCancelledEvent, Publisher, Subjects } from "@hh-bookstore/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}