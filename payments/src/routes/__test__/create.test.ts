import mongoose from "mongoose";
import request from "supertest";
import { Container } from "inversify";
import { OrderStatus } from "@hh-bookstore/common";

import { App } from "../../app";
import { Order } from "../../models/order";
import { Payment } from "../../models/payment";
import { configure } from "../../ioc";
import { stripe } from "../../utils/stripe";
import { natsClient } from "../../connections/nats-client";
jest.setTimeout(50000);

const container = new Container();
configure(container);
const app = new App(container);
app.initialMiddleware();
const server = app.server;

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("Create Routes", () => {
    it("has a route handler listening to /api/payments for post request", async () => {
        const orderId = new mongoose.Types.ObjectId().toHexString();

        const response = await request(server)
            .post("/api/payments")
            .send({
                token: 1231,
                orderId
            });

        expect(response.status).not.toEqual(404);
    });

    it("can only be accessed if the user is signed in", async () => {
        const orderId = new mongoose.Types.ObjectId().toHexString();

        await request(server)
            .post("/api/payments")
            .send({
                token: 1231,
                orderId
            })
            .expect(401);
    });

    it("returns a status other than 401 if the user is signed in", async () => {
        const cookie = await global.getCookie();
        const orderId = new mongoose.Types.ObjectId().toHexString();

        const response = await request(server)
            .post("/api/payments")
            .set("Cookie", cookie)
            .send({
                token: 1231,
                orderId
            });

        expect(response.status).not.toEqual(401);
    });

    it("return an error if an invalid orderId is provided", async () => {
        const cookie = await global.getCookie();

        await request(server)
            .post("/api/payments")
            .set("Cookie", cookie)
            .send({
                orderId: "",
                token: 123
            })
            .expect(400)

        await request(server)
            .post("/api/payments")
            .set("Cookie", cookie)
            .send({
                orderId: 10,
                token: 123
            })
            .expect(400)
    })

    it("return an a 404 error if the order does not exit", async () => {
        const cookie = await global.getCookie();
        const orderId = new mongoose.Types.ObjectId();

        await request(server)
            .post("/api/payments")
            .set("Cookie", cookie)
            .send({
                orderId,
                token: 123
            })
            .expect(404);
    });

    it("return a 401 error when purchasing an order that doesnt belong to the user", async () => {
        const cookie = await global.getCookie();
        const orderId = new mongoose.Types.ObjectId().toHexString();

        const order = Order.build({
            id: orderId,
            version: 0,
            userId: "12321",
            price: 123,
            status: OrderStatus.Created
        });
        await order.save();

        await request(server)
            .post("/api/payments")
            .set("Cookie", cookie)
            .send({
                token: 12312,
                orderId
            })
            .expect(401);
    });

    it("return a 400 error when purchasing a cancelled order", async () => {
        const orderId = new mongoose.Types.ObjectId().toHexString();
        const userId = new mongoose.Types.ObjectId().toHexString();
        const cookie = await global.getCookie(userId);

        const order = Order.build({
            id: orderId,
            version: 1,
            userId,
            price: 123,
            status: OrderStatus.Cancelled
        });
        await order.save();
        await request(server)
            .post("/api/payments")
            .set("Cookie", cookie)
            .send({
                orderId,
                token: 123
            })
            .expect(400);
    });

    it("returns a 201 with valid input", async () => {
        const orderId = new mongoose.Types.ObjectId().toHexString();
        const userId = new mongoose.Types.ObjectId().toHexString();
        const cookie = await global.getCookie(userId);
        const price = Math.floor(Math.random() * 10) + 1;

        const order = Order.build({
            id: orderId,
            version: 1,
            userId,
            price,
            status: OrderStatus.Created
        });
        await order.save();
        // Create a reusable source
        // https://stripe.com/docs/sources/customers#attaching-a-source-to-a-new-customer-object

        const source = await stripe.sources.create({
            type: "ach_credit_transfer",
            currency: "usd",
            owner: {
                email: "test@gmail.com"
            }
        });
        await sleep(5000);
        await request(server)
            .post("/api/payments")
            .set("Cookie", cookie)
            .send({
                orderId,
                token: source.id
            })
            .expect(201);

        const stripeCharges = await stripe.charges.list(
            { limit: 50 }
        );
        const stripeCharge = stripeCharges.data.find(charge => {
            return charge.amount === price * 100;
        });

        expect(stripeCharge!.amount).toEqual(price * 100);
        expect(stripeCharge!.currency).toEqual("usd");

        const payment = await Payment.findOne({
            orderId: order.id,
            stripeId: stripeCharge!.id
        });
        expect(natsClient.client.publish).toHaveBeenCalled();
        expect(payment).not.toBeNull();
    });
})
