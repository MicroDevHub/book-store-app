import { injectable, inject } from "inversify";
import config from "config";
import { ILogger, ILoggerFactory } from "@hh-bookstore/common";

import { natsClient } from "./nats-client";
import { NatsConfig } from "../types/nats";
import { OrderCreatedListener } from "../events/listeners/order-created-listener";
import { OrderCancelledListener } from "../events/listeners/order-cancelled-listener";

export interface INatsConnection {
    startConnect(): Promise<void>;
}

@injectable()
export class NatsConnection implements INatsConnection{
    private logger: ILogger;

    constructor(
        @inject("ILoggerFactory") loggerFactory: ILoggerFactory,
    ) {
        this.logger = loggerFactory(NatsConnection.name).logger;
    }

    public async startConnect() {
        try {
            const natsConfig: NatsConfig = config.get("natsConfig");
            this.logger.info("NATS connection starting...!", {
                operation: "NatsConnection.startConnect",
                parameters: {
                    natsConfig
                }
            });
            await natsClient.connect(natsConfig.clusterId, natsConfig.clientId, natsConfig.url);
            natsClient.client.on("close", () => {
                this.logger.warn("NATS connection closed !");
                process.exit();
            });

            this.logger.info("NATS connected successfully !");
            process.on("SIGINT", () => natsClient.client.close());
            process.on("SIGTERM", () => natsClient.client.close());
            this.listenEvent();
        } catch (error) {
            this.logger.error("Having an error when starting connect to NATs server", {
                Operation: "NatsConnection.startConnect",
                error,
            });
        }
    }

    private listenEvent (): void {
        new OrderCreatedListener(natsClient.client).listen();
        new OrderCancelledListener(natsClient.client).listen();
    }
}
