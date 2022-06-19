# Order-Service

This service will handle order creation and editing.

## 1. Starting On Local

This service is using Nodejs version 16.x.x

```bash
npm install
```
### Testing

```bash
npm run eslint && npm run test
```

### Start

```bash
npm run start
```
## 2. Routes

![alt text](../documents/assets/orders/routes.png)

After the service runs, the API for the service will be ready. We can proceed to verify it by testing the API through swagger or postman tools

## 3. Database

Here is the structural database of Order service.

In this one, we need each order's doc to have a reference to the Book model to get the necessary information from the book,
which be contained in order (title, price, version)

![alt text](../documents/assets/orders/structural-database.png)

So able to be doing this, we will use Mongoose Ref/Population Feature
(Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s). We may populate a single document, multiple documents, a plain object, multiple plain objects, or all objects returned from a query.)

![alt text](../documents/assets/orders/mongoose-ref-population.png)

## 3. Key Features
In each order that has been created, we have a configuration setting expired is 15 minutes and a status of order,
these setting to help:

- If no payment is provided after 15 minutes, an order should expire.
- If a payment is provided, the order should be marked as complete.
- If an order expires, the associated book should be marked as not being reserved, and the other order can pick up them
- If a book has been reserved, we should forbid editing the price of the book.
- If an order is cancelled after payment is provided, the payment should be refunded.

