import { natsClient } from './nats-client';
import { NatsConfig } from '../types/nats';
import config from "config";

export class NatsConnection {

    constructor() {
    }

    public async startConnect() {
        try {
            const natsConfig: NatsConfig = config.get('natsConfig');
            await natsClient.connect(natsConfig.clusterId, natsConfig.clientId, natsConfig.url);
            natsClient.client.on('close', () => {
                console.log('NATS connection closed!');
                process.exit();
            });
            process.on('SIGINT', () => natsClient.client.close());
            process.on('SIGTERM', () => natsClient.client.close());
        } catch (error) {
            console.error(error);
        }
    }
}
