import config from "config";
import { inject, injectable } from "inversify";
import { ILogger, ILoggerFactory } from "@hh-bookstore/common";
import { natsClient } from "./nats-client";
import { NatsConfig } from "../types/nats";
import { BookCreatedListener } from "../events/listeners/book-created-listener";
import { BookUpdatedListener } from "../events/listeners/book-updated-listener";
import { ExpirationCompleteListener } from "../events/listeners/expiration-complete-listener";

export interface INatsConnection {
    startConnect(): Promise<void>;
}

@injectable()
export class NatsConnection implements INatsConnection {
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
                this.logger.warn("NATS connection closed!");
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
        new BookUpdatedListener(natsClient.client).listen();
        new BookCreatedListener(natsClient.client).listen();
        new ExpirationCompleteListener(natsClient.client).listen();
    }
}
