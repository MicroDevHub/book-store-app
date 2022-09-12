import { natsClient } from "./nats-client";
import { NatsConfig } from "../types/nats";
import config from "config";
import { BookCreatedListener } from "../events/listeners/book-created-listener";
import { BookUpdatedListener } from "../events/listeners/book-updated-listener";
import { ExpirationCompleteListener } from "../events/listeners/expiration-complete-listener";

export class NatsConnection {
    constructor() {
    // TODO
    }

    public async startConnect() {
        try {
            const natsConfig: NatsConfig = config.get("natsConfig");
            // this.logger.info("NATS connection starting...!", {
            //     operation: "NatsConnection.startConnect",
            //     parameters: {
            //         natsConfig
            //     }
            // });
            await natsClient.connect(natsConfig.clusterId, natsConfig.clientId, natsConfig.url);
            natsClient.client.on("close", () => {
                // logger.info("NATS connection closed!");
                process.exit();
            });
            process.on("SIGINT", () => natsClient.client.close());
            process.on("SIGTERM", () => natsClient.client.close());
            this.listenEvent();
        } catch (error) {
            console.log(error);
            // logger.error("Having an error when starting connect to NATs server", {
            //     Operation: "NatsConnection.startConnect",
            //     error,
            // });
        }
    }

    private listenEvent (): void {
        new BookUpdatedListener(natsClient.client).listen();
        new BookCreatedListener(natsClient.client).listen();
        new ExpirationCompleteListener(natsClient.client).listen();
    }
}
