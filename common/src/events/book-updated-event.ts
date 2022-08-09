import { Subjects } from './subjects';

export interface BookUpdatedEvent {
    subject: Subjects.BookUpdated;
    data: {
        id: string;
        version: number;
        title: string;
        price: number;
        userId: string;
        orderId?: string;
    }
}