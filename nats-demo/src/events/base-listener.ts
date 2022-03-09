import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
    subject: Subjects,
    data: any
}

// Listener<T extends Event> this one it mean that whenever we tried to make use of a listener in any way,
// so in the other words, whenever we tried to extend it, we're going to have to provide some custom type to this.
// genetic type can be throught of as like an argument for types. So we can refer type <T> everywhere inside of 
// this our class definition 

export abstract class Listener<T extends Event> {
    // Name of the chanel this listener is going to listen to
    abstract subject: T['subject'];
    // Name of queue group this listener will join
    abstract queueGroupName: string;
    // Funtion to run when a message is recevied
    abstract onMessage(data: T['data'], msg: Message): void;
  
    // Pre-initialized NATS client
    private client: Stan;
    // Number of seconds that listener has to ack a message
    protected ackWait = 5 * 1000;
  
    constructor(client: Stan) {
      this.client = client;
    }
  
    // Default subscription option
    subscriptionOptions() {
      return this.client
        .subscriptionOptions()
        .setDeliverAllAvailable()           // This option will make sure that the first time our subscription is created
                                            // we get all messages on this chanel that have ever been emitted
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName);
    }
    
    listen() {
      console.log('test')
      const subscription = this.client.subscribe(
        this.subject,
        this.queueGroupName,
        this.subscriptionOptions()
      );
  
      subscription.on('message', (msg: Message) => {
        console.log(
          `Message recevied: ${this.subject} / ${this.queueGroupName}`
        );
  
        const parseData = this.parseMessage(msg);
        this.onMessage(parseData, msg);
      })
    }
  
    // Helper function to parse a message
    parseMessage(msg: Message) {
      const data = msg.getData();
      console.log('data: ', data)
      return typeof data === 'string'
      ? JSON.parse(data) 
      : JSON.parse(data.toString('utf-8'));     // the data is the buffer type we need to get the JSON out of it
    }
  }
  