import { Subjects } from './subjects';

export interface BookCreatedEvent {
    subject: Subjects.BookCreated;
    data: {
        id: string;
        version: number;
        title: string;
        price: number;
        userId: string;
    }
}