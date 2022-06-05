import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from 'config';

jest.setTimeout(10000);

declare global {
    var getCookie: () => string[];
}

// this one will let Jest know, when having any request to real function, it will redirect to mock function.
jest.mock('../connections/nats-client');

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

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.getCookie = () => {
    // Build a JWT payload. { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@gmail.com'
    };

    // Create the JWT
    const token = jwt.sign(payload, config.get('jwt_key'));

    // Build session Object { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session in JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // Return a string that the cookie with the encoded data
    return [`session=${base64}; path=/; httponly`];
};
