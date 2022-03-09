import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';
import { Subjects } from './subjects';
import { BookCreatedEvent } from './book-created-event';

export class BookCreatedListener extends Listener<BookCreatedEvent> {
    // we need to provide the type of subject here to let typescript know
    // the value of subject always equal with the value of book created

    // or we can use the property readonly of typescript to make sure this value is not change
    // It will look like:
    // readonly subject = Subjects.BookCreated;
    
    subject: Subjects.BookCreated = Subjects.BookCreated;
    queueGroupName = 'payments-service';
  
    onMessage(data: BookCreatedEvent['data'], msg: Message): void {
      console.log('Event data: ', data.id);
   
      msg.ack();
    }
}