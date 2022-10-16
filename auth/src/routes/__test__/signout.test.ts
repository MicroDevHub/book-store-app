import request from "supertest";
import { Container } from "inversify";

import { App } from "../../app";
import { configure } from "../../ioc";

jest.setTimeout(60000);
const container = new Container();
configure(container);
const app = new App(container);
app.initialMiddleware();
const server = app.server;

describe("Signout", () => {
    it("should clears a cookie after signing out", async () => {
        await request(server)
            .post("/api/users/signup")
            .send({
                email: "test@test.com",
                password: "password"
            })
            .expect(201);

        const response = await request(server)
            .post("/api/users/signout")
            .send({})
            .expect(200);

        expect(response.get("Set-Cookie")[0]).toEqual("session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly");
    });
});
