import request from "supertest";
import { Container } from "inversify";

import { App } from "../../app";
import { configure } from "../../ioc";

jest.setTimeout(50000);
const container = new Container();
configure(container);
const app = new App(container);
app.initialMiddleware();
const server = app.server;

const createBook = async () => {
    const cookie = await global.getCookie();
    return request(server).post("/api/books")
        .set("Cookie", cookie)
        .send({
            title: "tram nam khong quen",
            price: 10
        });
};

it("can fetch a list of books", async () => {
    await createBook();
    await createBook();
    await createBook();

    const response = await request(server)
        .get("/api/books")
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
});
