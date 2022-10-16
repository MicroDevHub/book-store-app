# Book-Service

This service will handle book creation and editing.

## 1. Starting On Local

This service is using Nodejs version 16.x.x

```bash
npm install
### Testing
npm run eslint && npm run test
### Start
npm run start
```

## 2. Routes

![alt text](../documents/assets/books/book-srv-api.png)
![alt text](../documents/assets/books/book-route.png)

After the service runs successfully, the API for the service will be ready.
We can proceed to verify it by testing the API through swagger or postman tools

## 3. Database

Here is the structural database of Book service.

### 3.1 Book Model

![alt text](../documents/assets/books/book-model.png)

## 3. Integrate with NATS

![alt text](../documents/assets/books/book-intergrate-nats.png)

### 3.1. Event Flow

**LISTENER**

- OrderCancelledPublisher

![alt text](../documents/assets/events/order_cancelled-event.png)

- OrderCreatedPublisher

![alt text](../documents/assets/events/order_created-event.png)

**PUBLISHER**

- BookCreatedListener

![alt text](../documents/assets/events/book_created-event.png)

- BookUpdatedListener

![alt text](../documents/assets/events/book_updated-event.png)


