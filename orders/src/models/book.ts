import mongoose from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@hh-bookstore/common";

interface BookAttrs {
    id: string;
    title: string;
    price: number;
}

export interface BookDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface BookModel extends mongoose.Model<BookDoc> {
    build(attrs: BookAttrs): BookDoc;
    findByIdAndPreviousVersion(event: {
        id: string,
        version: number
    }): Promise<BookDoc | null>;
}

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
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

bookSchema.statics.build = (attrs: BookAttrs) => {
    return new Book({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
        version: 0,
    });
};

bookSchema.statics.findByIdAndPreviousVersion = async (event: {
    id: string,
    version: number
}) => {
    return await Book.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};

bookSchema.set("versionKey", "version");
bookSchema.pre("save", function(done) {
    // this operator will tell mongoose find the previous version of document
    // before saving a new document
    this.$where = {
        version: this.get("version") - 1
    };

    done();
})

bookSchema.methods.isReserved = async function() {
    // Run query to look at all orders. Find an orders where the book
    // is the book we just found *and* the order status is *not* cancelled.
    // If we find an orders from that means the book *is* reserved

    // this === the book document that we just called 'isReserved' on
    const existingOrder = await Order.findOne({
        book: this as BookDoc,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    return !!existingOrder;
};

const Book = mongoose.model<BookDoc, BookModel>("Book", bookSchema);

export { Book };
