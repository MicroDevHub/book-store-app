import mongoose from "mongoose";
import { OrderStatus } from "@hh-bookstore/common";
import { BookDoc } from "./book";

interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    book: BookDoc;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    book: BookDoc;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus)
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date,
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
);

OrderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", OrderSchema);

export { Order };
