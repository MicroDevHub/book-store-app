export interface OrderCreatedEvent {
    id: string;
    version: number;
    status: string;
    userId: string;
    expiresAt: string;
    book: {
        id: string;
        price: number;
    };
}
