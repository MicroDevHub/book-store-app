import request from "supertest";
import { App } from "../../app";
import mongoose from "mongoose";
import { Book } from "../../models/book";
import { Container } from "inversify";
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
        price: 20,
    })
    return await book.save();
};

describe("Get Routes", () => {
    it("returns a 404 if the orders is not found", async () => {
        const orderId = new mongoose.Types.ObjectId().toHexString();
        await request(server)
            .get(`/api/books/${orderId}`)
            .send()
            .expect(404);
    });

    it("returns an error if one user tries to fetch another users orders", async () => {
        const userOne = await global.getCookie();
        const userTwo = await global.getCookie();
        const book = await createBook();

        const { body: orders } = await request(server).post("/api/orders")
            .set("Cookie", userOne)
            .send({
                bookId: book.id
            })
            .expect(201)

        await request(server).get(`/api/orders/${orders.id }`)
            .set("Cookie", userTwo)
            .send()
            .expect(401)
    })

    it("returns the orders if the orders is found and is authorised", async () => {
        const cookie = await global.getCookie();
        const book = await createBook();

        const { body: orders } = await request(server).post("/api/orders")
            .set("Cookie", cookie)
            .send({
                bookId: book.id
            })
            .expect(201)

        const { body: fetchedOrder } = await request(server).get(`/api/orders/${orders.id }`)
            .set("Cookie", cookie)
            .send()
            .expect(200)

        expect(fetchedOrder.id).toEqual(orders.id);
    })

    it.todo("emits a orders cancelled event");
})