import { useState } from "react";
import Router from "next/router";
import userRequest from "../../hooks/use-request";

const NewBook = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");

    const { doRequest, errors } = userRequest({
        url: "/api/books",
        method: "post",
        body: {
            title,
            price,
        },
        onSuccess: () => Router.push("/"),
    });

    const onSubmit = (event) => {
        event.preventDefault;
        doRequest();
    };

    const onBlur = () => {
        const value = parseFloat(price);

        if (isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2));
    };

    return (
        <div>
            <h1>Create a Book</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           className="form-control" />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input
                        value={price}
                        onBlur={onBlur}
                        onChange={(e) => setPrice(e.target.value)}
                        className="form-control"/>
                </div>
                <button className="btn btn-primary">Submit</button>
                {errors}
            </form>
        </div>
    );
}

export default NewBook;