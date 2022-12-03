import { App } from "./app";
import { Container } from "inversify";
import { configure } from "./ioc";

export const start = async () => {
    try {
        const container = new Container();
        configure(container);
        const app = new App(container);
        await app.start();
    } catch (err) {
        console.error(err);
    }
};

start();





