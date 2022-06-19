import { natsClient } from "./nats-client";
import { NatsConfig } from "../types/nats";
import config from "config";
import { BookCreatedListener } from "../events/listeners/book-created-listener";
import { BookUpdatedListener } from "../events/listeners/book-updated-listener";

export class NatsConnection {

    constructor() {
    // TODO
    }

    public async startConnect() {
        try {
            const natsConfig: NatsConfig = config.get("natsConfig");
            await natsClient.connect(natsConfig.clusterId, natsConfig.clientId, natsConfig.url);
            natsClient.client.on("close", () => {
                console.log("NATS connection closed!");
                process.exit();
            });
            process.on("SIGINT", () => natsClient.client.close());
            process.on("SIGTERM", () => natsClient.client.close());

            new BookUpdatedListener(natsClient.client).listen();
            new BookCreatedListener(natsClient.client).listen();
        } catch (error) {
            console.error(error);
        }
    }
}
