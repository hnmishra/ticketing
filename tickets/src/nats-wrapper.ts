import nats, { Stan } from "node-nats-streaming";
import { Subjects } from "@hnticketing/common";
//singleton class

class NatsWrapper {
    private _client?: Stan;
    get client() { 
        if (!this._client) {
            throw new Error('Cannot access NATS client before connecting');
        }
        return this._client;
    }
    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, { url });
        //grace full closing
       
        return new Promise<void>((resolve, reject) => {
            this._client!.on('connect', () => {
                console.log('Connected to NATS');
                resolve();
            });
            this._client!.on('error', (err) => {
                reject(err);
            });
        });
    }
}
//singleton instance becuase we are exporting an instance of the class
export const natsWrapper = new NatsWrapper();


