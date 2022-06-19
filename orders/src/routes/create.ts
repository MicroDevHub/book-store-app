import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import {
    requireAuth,
    validateRequest,
    NotFoundError,
    OrderStatus,
    BadRequestError
} from "@hh-bookstore/common";
import { natsClient } from "../connections/nats-client";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { Book } from "../models/book";
import { Order } from "../models/order";

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = express.Router();

router.post(
    "/api/orders",
    requireAuth,
    [
        body("bookId")
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("BookId is required"),
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { bookId } = req.body;

            // Find the book the user is trying orders in the database
            const book =  await Book.findById(bookId);

            if (!book) {
                return next(new NotFoundError());
            }

            // Make sure that this book is not already reserved

            const isReserved = await book.isReserved();
            if (isReserved) {
                return next(new BadRequestError("Book is already reserved"));
            }

            // Calculate an expiration date for this orders
            const expiration = new Date();
            expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

            // Build the orders and save it to the database
            const order = Order.build({
                userId: req.currentUser!.id,
                status: OrderStatus.Created,
                expiresAt: expiration,
                book
            });

            await order.save();

            // Publish an event saying that an orders was created
            await new OrderCreatedPublisher(natsClient.client).publish({
                id: order.id,
                status: order.status,
                userId: order.userId,
                expiresAt: order.expiresAt.toISOString(),
                book: {
                    id: book.id,
                    price: book.price,
                },
            });

            res.status(201).send(order);
        } catch (e) {
            return next(e);
        }
    }
);

export { router as createOrderRouter };
