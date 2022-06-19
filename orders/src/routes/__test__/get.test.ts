// import request from "supertest";
// import { app } from "../../app";
// import mongoose from "mongoose";
// import { Book } from "../../models/book";
//
// const createBook = async () => {
//     const book = Book.build({
//         title: "tram nam khong quen",
//         price: 20
//     })
//     return await book.save();
// };

// it("returns a 404 if the orders is not found", async () => {
//     const orderId = new mongoose.Types.ObjectId().toHexString();
//     await request(app)
//         .get(`/api/books/${orderId}`)
//         .send()
//         .expect(404);
// });

// it("returns an error if one user tries to fetch another users orders", async () => {
//     const userOne = await global.getCookie();
//     const userTwo = await global.getCookie();
//     const book = await createBook();
//
//     const { body: orders } = await request(app).post("/api/orders")
//         .set("Cookie", userOne)
//         .send({
//             bookId: book.id
//         })
//         .expect(201)
//
//     await request(app).get(`/api/orders/${orders.id }`)
//         .set("Cookie", userTwo)
//         .send()
//         .expect(401)
// })

// it("returns the orders if the orders is found and is authorised", async () => {
//     const cookie = await global.getCookie();
//     const book = await createBook();
//
//     const { body: orders } = await request(app).post("/api/orders")
//         .set("Cookie", cookie)
//         .send({
//             bookId: book.id
//         })
//         .expect(201)
//
//     const { body: fetchedOrder } = await request(app).get(`/api/orders/${orders.id }`)
//         .set("Cookie", cookie)
//         .send()
//         .expect(200)
//
//     expect(fetchedOrder.id).toEqual(orders.id);
// })

it.todo("emits a orders cancelled event");