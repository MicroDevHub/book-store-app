import request from "supertest";
import { Container } from "inversify";
import mongoose from "mongoose";

import { App } from "../../app";
import { configure } from "../../ioc";

const container = new Container();
configure(container);
const app = new App(container);
app.initialMiddleware();
const server = app.server;

describe("Get books", () => {
    it("returns a 404 if the book is not found", async () => {
        const id = new mongoose.Types.ObjectId().toHexString();

        await request(server)
            .get(`/api/books/${id}`)
            .send()
            .expect(404);
    });

    it("returns the book if the book is found", async () => {
        const title = "tram nam khong quen";
        const price = 20;

        const cookie = await global.getCookie();

        const response = await request(server)
            .post("/api/books")
            .set("Cookie", cookie)
            .send({
                title,
                price
            })
            .expect(201);

        const bookResponse = await request(server)
            .get(`/api/books/${response.body.id}`)
            .send()
            .expect(200);

        expect(bookResponse.body.title).toEqual(title);
        expect(bookResponse.body.price).toEqual(price);
    });
});
