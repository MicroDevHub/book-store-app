import { Subjects } from './subjects';

export interface BookUpdatedEvent {
    subject: Subjects.BookUpdated;
    data: {
        id: string;
        title: string;
        price: number;
        userId: string;
    }
}