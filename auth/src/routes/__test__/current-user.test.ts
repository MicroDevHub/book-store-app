import request from "supertest";
import { Container } from "inversify";

import { App } from "../../app";
import { configure } from "../../ioc";

const container = new Container();
configure(container);
const app = new App(container);
app.initialMiddleware();
const server = app.server;

describe("Current user", () => {
    it("should responds with details about the current user", async () => {
        const cookie = await global.getCookie();

        const response = await request(server)
            .get("/api/users/currentuser")
            .set("Cookie", cookie)
            .send()
            .expect(200);

        expect(response.body.currentUser.email).toEqual("test@test.com");

    });

    // it('should returns a 401 with missing cookie', async () => {
    //     await request(server)
    //         .get('/api/users/currentuser')
    //         .send()
    //         .expect(401);
    // });
});
