export enum OrderStatus {
    // When the order has been created, and the
    // book it is trying to order has not been reserved
    Created = 'created',

    // The book the order is trying to reserve has already
    // reserved, or when the user has cancelled the orders.
    // The order expire before payment
    Cancelled = 'cancelled',

    // The order has been successfully reserved the book
    AwaitingPayment = 'awaiting:payment',

    // The order has reserved the book and the user has been
    // provided payment successfully
    Complete = 'complete',
}