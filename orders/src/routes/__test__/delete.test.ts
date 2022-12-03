import mongoose from "mongoose";
import request from "supertest";
import { Container } from "inversify";
import { OrderStatus } from "@hh-bookstore/common";

import { App } from "../../app";
import { Book } from "../../models/book";
import { Order } from "../../models/order";
import { natsClient } from "../../connections/nats-client";
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
    });
    return await book.save();
};

describe("Delete Routes", () => {
    it("returns a 404 if the orders is not found", async () => {
        const orderId = new mongoose.Types.ObjectId().toHexString();

        await request(server)
            .delete(`/api/books/${orderId}`)
            .send()
            .expect(404);
    });

    it("returns an error if one user tries to delete another users orders", async () => {
        const userOne = await global.getCookie();
        const userTwo = await global.getCookie();
        const book = await createBook();

        const { body: order } = await request(server).post("/api/orders")
            .set("Cookie", userOne)
            .send({
                bookId: book.id
            })
            .expect(201);

        await request(server).delete(`/api/orders/${order.id }`)
            .set("Cookie", userTwo)
            .send()
            .expect(401);
    });

    it("delete the orders if the orders is found and is authorised", async () => {
        const cookie = await global.getCookie();
        const bookId = new mongoose.Types.ObjectId().toHexString();

        const book = Book.build({
            id: bookId,
            title: "TNKQ",
            price: 20
        });
        await book.save();

        const { body: order } = await request(server).post("/api/orders")
            .set("Cookie", cookie)
            .send({
                bookId: book.id
            })
            .expect(201);

        await request(server).delete(`/api/orders/${order.id }`)
            .set("Cookie", cookie)
            .send()
            .expect(204);

        const updatedOrder = await Order.findById(order.id);
        expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    });

    it("emits a orders cancelled event", async () => {
        const cookie = await global.getCookie();
        const bookId = new mongoose.Types.ObjectId().toHexString();

        const book = Book.build({
            id: bookId,
            title: "TNKQ",
            price: 20
        });
        await book.save();

        const { body: order } = await request(server).post("/api/orders")
            .set("Cookie", cookie)
            .send({
                bookId: book.id
            })
            .expect(201);

        await request(server).delete(`/api/orders/${order.id}`)
            .set("Cookie", cookie)
            .send()
            .expect(204);

        expect(natsClient.client.publish).toHaveBeenCalled();
    });
})