import nats from 'node-nats-streaming';
import { BookCreatedPublisher } from './events/Book-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new BookCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: '123',
      price: 123,
      title: 'Tram nam khong quen'
    });
  } catch (error) {
    console.log(error);    
  }

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // });

  // stan.publish('book:created', data, () => {
  //   console.log('Event published');
  // });
});
