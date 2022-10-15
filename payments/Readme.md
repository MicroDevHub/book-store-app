# Payment-Service

This service will handle payment creation and editing.

## 1. Starting On Local

This service is using Nodejs version 16.x.x

```bash
npm install
### Testing
npm run eslint && npm run test
### Start
npm run start
```

Docket build:
```bash
docker build -t @huyhoang1001/payments .
```


## 2. Routes

![alt text](../documents/assets/payments/routes.png)

After the service runs successfully, the API for the service will be ready.
We can proceed to verify it by testing the API through swagger or postman tools

## 3. Database

Here is the structural database of payment service.

![alt text](../documents/assets/payments/structural-database.png)

we need each payment's doc to have a reference to the Book model to get the necessary information from the book,
which be contained in payment (title, price, version).

So to be able doing this, we will use Mongoose Ref/Population Feature
(Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s). We may populate a single document, multiple documents, a plain object, multiple plain objects, or all objects returned from a query.)

![alt text](../documents/assets/payments/mongoose-ref-population.png)

### 3.1 Payment Model

#### Describe Properties:

## 3. Integrate with NATS

### 3.1. Event Flow

**LISTENER**

- BookCreatedListener

![alt text](../documents/assets/events/book_created-event.png)

- BookUpdatedListener

![alt text](../documents/assets/events/book_updated-event.png)

- ExpirationCompleteListener: The listener event for expiration event when the order isn't provided a payment after 15 minutes.
  
![alt text](../documents/assets/events/expiration_complete-event.png)

**PUBLISHER**

- OrderCancelledPublisher

![alt text](../documents/assets/events/order_cancelled-event.png)


- OrderCreatedPublisher

![alt text](../documents/assets/events/order_created-event.png)






