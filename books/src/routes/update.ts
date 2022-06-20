import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import {
    validateRequest,
    NotFoundError,
    requireAuth,
    NotAuthorizedError
} from "@hh-bookstore/common";
import { Book } from "../models/book";
import { BookUpdatedPublisher } from "../events/publisher/book-updated-publisher";
import { natsClient } from "../connections/nats-client";

const router = express.Router();

router.put(
    "/api/books/:id",
    requireAuth,
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price must be provided and must be greater than 0")
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return next(new NotFoundError());
        }

        if (book.userId !== req.currentUser!.id) {
            return next(new NotAuthorizedError());
        }

        book.set({
            title: req.body.title,
            price: req.body.price
        });
        await book.save();

        // Send book-updated event to NATs server
        await new BookUpdatedPublisher(natsClient.client).publish({
            id: book.id,
            version: book.version,
            title: book.title,
            price: book.price,
            userId: book.userId
        });

        res.send(book);
    }
);

export { router as updateBookRouter };
