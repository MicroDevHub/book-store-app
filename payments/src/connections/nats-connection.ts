import { natsClient } from "./nats-client";
import { NatsConfig } from "../types/nats";
import config from "config";
import { OrderCreatedListener } from "../events/listeners/order-created-listener";
import { OrderCancelledListener } from "../events/listeners/order-cancelled-listener";

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
        new OrderCreatedListener(natsClient.client).listen();
        new OrderCancelledListener(natsClient.client).listen();
    }
}
