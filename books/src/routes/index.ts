import express, { Request, Response } from "express";
import { Book } from "../models/book";

const router = express.Router();

router.get("/api/books", async (req: Request, res: Response) => {
    const books = await Book.find({
        orderId: undefined,
    });

    res.send(books);
});

export { router as indexBookRouter };
