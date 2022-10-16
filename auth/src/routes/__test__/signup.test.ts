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

describe("Signup", () => {
    it("should return a 201 on successful signup", () => {
        return request(server)
            .post("/api/users/signup")
            .send({
                email: "test@test.com",
                password: "password"
            })
            .expect(201);
    });

    it("should returns a 400 with an invalid email", () => {
        return request(server)
            .post("/api/users/signup")
            .send({
                email: "test.com",
                password: "password"
            })
            .expect(400);
    });

    it("should returns a 400 with an invalid password", () => {
        return request(server)
            .post("/api/users/signup")
            .send({
                email: "test@test.com",
                password: "p"
            })
            .expect(400);
    });

    it("should returns a 400 with missing email and password", async () => {
        await request(server)
            .post("/api/users/signup")
            .send({
                email: "test@test.com"
            })
            .expect(400);

        await request(server)
            .post("/api/users/signup")
            .send({
                password: "test@test.com"
            })
            .expect(400);
    });

    it("should disallow duplicate emails", async () => {
        await request(server)
            .post("/api/users/signup")
            .send({
                email: "test@test.com",
                password: "password"
            })
            .expect(201);

        await request(server)
            .post("/api/users/signup")
            .send({
                email: "test@test.com",
                password: "password"
            })
            .expect(400);
    });

    it("should sets a cookie after successful signup", async () => {
        const response = await request(server)
            .post("/api/users/signup")
            .send({
                email: "test@test.com",
                password: "password"
            })
            .expect(201);

        expect(response.get("Set-Cookie")).toBeDefined();
    });
});
