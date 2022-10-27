import useRequest from "../../hooks/use-request";
import Router from "next/router";

const BookShow = ({ book }) => {
    const { doRequest, errors } = useRequest({
        url: "/api/orders",
        method: "post",
        body: {
            bookId: book.id
        },
        onSuccess: (order) => Router.push("/orders/[orderId]", `/orders/${order.id}`)
    });

    return (
        <div>
            <h1>{book.title}</h1>
            <h1>Price: {book.price}</h1>
            <button onClick={(event) => doRequest()} className="btn btn-primary">Purchase</button>
            {errors}
        </div>
    );
};

BookShow.getInitialProps = async (context, client) => {
    const { bookId } = context.query;
    const { data } = await client.get(`/api/books/${bookId}`);

    return {
        book: data
    };
}

export default BookShow;