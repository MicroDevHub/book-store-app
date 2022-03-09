import { Subjects } from './subjects';

export interface BookCreatedEvent {
    subject: Subjects.BookCreated;
    data: {
        id: string;
        title: string;
        price: number;
        userId: string;
    }
}