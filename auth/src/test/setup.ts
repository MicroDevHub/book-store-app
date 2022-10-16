import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { Container } from "inversify";

import { App } from "../app";
import { configure } from "../ioc";

const container = new Container();
configure(container);
const app = new App(container);
app.initialMiddleware();
const server = app.server;

declare global {
    /* eslint-disable */
    var getCookie: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    jest.useFakeTimers('legacy');
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.getCookie = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(server)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
        .expect(201);

    return response.get('Set-Cookie');
};
