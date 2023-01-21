import mongoose from "mongoose";
import request from "supertest";
import { Container } from "inversify";
import { OrderStatus } from "@hh-bookstore/common";

import { App } from "../../app";
import { Order } from "../../models/order";
import { Book } from "../../models/book";
import { natsClient } from "../../connections/nats-client";
import { configure } from "../../ioc";
jest.setTimeout(50000);

const container = new Container();
configure(container);
const app = new App(container);
app.initialMiddleware();
const server = app.server;

describe("Create Routes", () => {
    it("has a route handler listening to /api/orders for post request", async () => {
        const response = await request(server)
            .post("/api/orders")
            .send({});

        expect(response.status).not.toEqual(404);
    });

    it("can only be accessed if the user is signed in", async () => {
        await request(server)
            .post("/api/orders")
            .send({})
            .expect(401);
    });

    it("returns a status other than 401 if the user is signed in", async () => {
        const cookie = await global.getCookie();
        const response = await request(server)
            .post("/api/orders")
            .set("Cookie", cookie)
            .send({});

        expect(response.status).not.toEqual(401);
    });

    it("return an error if an invalid bookId is provided", async () => {
        const cookie = await global.getCookie();

        await request(server)
            .post("/api/orders")
            .set("Cookie", cookie)
            .send({
                bookId: "",
            })
            .expect(400);

        await request(server)
            .post("/api/orders")
            .set("Cookie", cookie)
            .send({
                bookId: 10
            })
            .expect(400);
    });

    it("return an error if the book does not exit", async () => {
        const cookie = await global.getCookie();
        const bookId = new mongoose.Types.ObjectId();

        await request(server)
            .post("/api/orders")
            .set("Cookie", cookie)
            .send({
                bookId,
            })
            .expect(404);
    });

    it("return an error if the book is already reserved", async () => {
        const cookie = await global.getCookie();
        const bookId = new mongoose.Types.ObjectId().toHexString();

        const book = Book.build({
            id: bookId,
            title: "tram nam khong quen",
            price: 20
        });
        await book.save();
        const order = Order.build({
            book,
            userId: "123123123",
            status: OrderStatus.Created,
            expiresAt: new Date()
        });
        await order.save();
        await request(server)
            .post("/api/orders")
            .set("Cookie", cookie)
            .send({
                bookId: book.id
            })
            .expect(400);
    });

    it("reserves a book", async () => {
        const cookie = await global.getCookie();
        const bookId = new mongoose.Types.ObjectId().toHexString();

        const book = Book.build({
            id: bookId,
            title: "tram nam khong quen",
            price: 20
        });
        await book.save();
        await request(server)
            .post("/api/orders")
            .set("Cookie", cookie)
            .send({
                bookId: book.id
            })
            .expect(201);
    });

    it("publishes an event", async () => {
        const cookie = await global.getCookie();
        const bookId = new mongoose.Types.ObjectId().toHexString();

        const book = Book.build({
            id: bookId,
            title: "tram nam khong quen",
            price: 20
        });
        await book.save();

        await request(server)
            .post("/api/orders")
            .set("Cookie", cookie)
            .send({
                bookId: book.id
            })
            .expect(201);

        expect(natsClient.client.publish).toHaveBeenCalled();
    });
});
