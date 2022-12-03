import request from "supertest";
import { Container } from "inversify";
import mongoose from "mongoose";

import { App } from "../../app";
import { Book } from "../../models/book";
import { configure } from "../../ioc";
jest.setTimeout(50000);

const container = new Container();
configure(container);
const app = new App(container);
app.initialMiddleware();
const server = app.server;

const createBook = async () => {
    const bookId = new mongoose.Types.ObjectId().toHexString();
    const book = Book.build({
        id: bookId,
        title: "tram nam khong quen",
        price: 20
    })
    return await book.save();
};

describe("Index Routes", () => {
    it("can fetch a list of orders for an particular user", async () => {
        const bookOne = await createBook();
        const bookTwo = await createBook();
        const bookThree = await createBook();

        const userOne = global.getCookie();
        const userTwo = global.getCookie();

        // create on orders as User #1
        request(server).post("/api/orders")
            .set("Cookie", userOne)
            .send({
                bookId: bookOne.id
            })
            .expect(201)

        // create on orders as User #2
        await request(server).post("/api/orders")
            .set("Cookie", userTwo)
            .send({
                bookId: bookTwo.id
            })
            .expect(201)
        await request(server).post("/api/orders")
            .set("Cookie", userTwo)
            .send({
                bookId: bookThree.id
            })
            .expect(201)

        // Make request to get orders for User #2
        const response = await request(server).get("/api/orders")
            .set("Cookie", userTwo)
            .send({
                bookId: bookTwo.id
            })
            .expect(200)

        expect(response.body.length).toEqual(2)
    })
})