import config from "config";
import { natsClient } from "./nats-client";
import { NatsConfig } from "../types/nats";
import { OrderCreatedListener } from "../events/listeners/order-created-listener";

export class NatsConnection {
    public async startConnect () {
        try {
            const natsConfig: NatsConfig = config.get("natsConfig");
            await natsClient.connect(natsConfig.clusterId, natsConfig.clientId, natsConfig.url);
            natsClient.client.on("close", () => {
                console.log("NATS connection closed!");
                process.exit();
            });
            process.on("SIGINT", () => natsClient.client.close());
            process.on("SIGTERM", () => natsClient.client.close());

            new OrderCreatedListener(natsClient.client).listen();
        } catch (error) {
            console.error(error);
        }
    }
}
