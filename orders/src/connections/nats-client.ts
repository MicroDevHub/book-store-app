import nats, { Stan } from "node-nats-streaming";

class NatsClient {
    // the operator ? let typescript know, this property might be undefined in the period time
    private _client?: Stan;

    get client() {
        if (!this._client) {
            throw new Error("Cannot access to NATS client before connecting");
        } else {
            return this._client;
        }
    }

    connect(clusterId: string, clientId: string, url: string): Promise<void> {
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise((resolve, reject) => {
            this.client!.on("connect", () => {
                console.log("Connected to Nats server");
                resolve();
            });

            this.client!.on("error", (err) => {
                reject(err);
            });
        });
    }
}

export const natsClient = new NatsClient();
