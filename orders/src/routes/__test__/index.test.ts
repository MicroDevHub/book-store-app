// import request from 'supertest';
// import { app } from '../../app';
// import { Book } from "../../models/book";
//
// const createBook = async () => {
//     const book = Book.build({
//         title: 'tram nam khong quen',
//         price: 20
//     })
//     return await book.save();
// };
//
// it('can fetch a list of orders for an particular user', async () => {
//     const bookOne = await createBook();
//     const bookTwo = await createBook();
//     const bookThree = await createBook();
//
//     const userOne = global.getCookie();
//     const userTwo = global.getCookie();
//
//     // create on orders as User #1
//     request(app).post('/api/orders')
//         .set('Cookie', userOne)
//         .send({
//             bookId: bookOne.id
//         })
//         .expect(201)
//
//     // create on orders as User #2
//     await request(app).post('/api/orders')
//         .set('Cookie', userTwo)
//         .send({
//             bookId: bookTwo.id
//         })
//         .expect(201)
//     await request(app).post('/api/orders')
//         .set('Cookie', userTwo)
//         .send({
//             bookId: bookThree.id
//         })
//         .expect(201)
//
//     // Make request to get orders for User #2
//     const response = await request(app).get('/api/orders')
//         .set('Cookie', userTwo)
//         .send({
//             bookId: bookTwo.id
//         })
//         .expect(200)
//
//     expect(response.body.length).toEqual(2)
// })

it.todo("emits a orders cancelled event");