import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import {
    requireAuth,
    validateRequest,
    NotFoundError,
    OrderStatus,
    BadRequestError, NotAuthorizedError
} from "@hh-bookstore/common";

import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { stripe } from "../utils/stripe";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsClient } from "../connections/nats-client";

const router = express.Router();

router.post(
    "/api/payments",
    requireAuth,
    [
        body("token")
            .not()
            .isEmpty()
            .withMessage("Token is required"),
        body("orderId")
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("OrderId is required"),
    ],
    validateRequest,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, orderId } = req.body;

            // Find the order which the user is trying payment in the database
            const order =  await Order.findById(orderId);

            if (!order) {
                return next(new NotFoundError());
            }

            // Make sure the order belong to this user
            if (order.userId !== req.currentUser!.id) {
                return next(new NotAuthorizedError());
            }

            // Make sure that this book is not already reserved
            if (order.status === OrderStatus.Cancelled) {
                return next(new BadRequestError("Cannot pay for an cancelled order"));
            }

            const charge = await stripe.charges.create({
                amount: order.price * 100,
                currency: "usd",
                source: token
            });

            const payment = Payment.build({
                orderId,
                stripeId: charge.id
            });
            await payment.save();
            await new PaymentCreatedPublisher(natsClient.client).publish({
                id: payment.id,
                orderId: payment.orderId,
                stripeId: payment.stripeId
            });

            res.status(201).send({ id: payment.id });
        } catch (e) {
            return next(e);
        }
    }
);

export { router as createPaymentRouter };
