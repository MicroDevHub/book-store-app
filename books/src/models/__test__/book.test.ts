import { Book } from "../book";

describe("Book model", () => {
    it("Implements optimistic concurrency control", async () => {
        // Create an instance of a book
        const book = Book.build({
            title: "tram nam khong quen",
            price: 10,
            userId: "123"
        });

        // Save the book to the database
        await book.save();

        // Fetch the book twice
        const firstInstance = await Book.findById(book.id);
        const secondInstance = await Book.findById(book.id);

        // Make two separate changes to the book we fetched
        firstInstance!.set({ price: 10 });
        secondInstance!.set({ price: 15 });

        // Save the first fetched ticket
        await firstInstance!.save();

        // Save the second fetched ticket and expect an error
        try {
            await secondInstance!.save();
        } catch (err) {
            return;
        }

        /* eslint-disable no-undef */
        fail("This is not the expect response");
    });

    it("Increments the version number on multiple saves", async () => {
        // Create an instance of a book
        const book = Book.build({
            title: "tram nam khong quen",
            price: 10,
            userId: "123"
        });

        // Save the book to the database
        await book.save();
        expect(book.version).toEqual(0);
        await book.save();
        expect(book.version).toEqual(1);
    });
});
