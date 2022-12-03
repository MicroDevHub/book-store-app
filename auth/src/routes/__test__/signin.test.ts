import request from "supertest";
import { Container } from "inversify";

import { configure } from "../../ioc";
import { App } from "../../app";

const container = new Container();
configure(container);
const app = new App(container);
app.initialMiddleware();
const server = app.server;
jest.setTimeout(60000);

describe("Signin", () => {
    it("should fail when a email that does not exists is supplied", async () => {
        await request(server)
            .post("/api/users/signin")
            .send({
                email: "test@test.com",
                password: "password"
            })
            .expect(400);
    });

    it("should fail when an incorrect password is supplied", async () => {
        await request(server)
            .post("/api/users/signup")
            .send({
                email: "test@test.com",
                password: "password"
            })
            .expect(201);

        await request(server)
            .post("/api/users/signin")
            .send({
                email: "test@test.com",
                password: "password1"
            })
            .expect(400);
    });

    it("should responds with a cookie when given a valid password", async () => {
        await request(server)
            .post("/api/users/signup")
            .send({
                email: "test@test.com",
                password: "password"
            })
            .expect(201);

        const response = await request(server)
            .post("/api/users/signin")
            .send({
                email: "test@test.com",
                password: "password"
            })
            .expect(200);

        expect(response.get("Set-Cookie")).toBeDefined();
    });

});
