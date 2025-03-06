"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.natsWrapper = void 0;
const node_nats_streaming_1 = __importDefault(require("node-nats-streaming"));
//singleton class
class NatsWrapper {
    get client() {
        if (!this._client) {
            throw new Error('Cannot access NATS client before connecting');
        }
        return this._client;
    }
    connect(clusterId, clientId, url) {
        this._client = node_nats_streaming_1.default.connect(clusterId, clientId, { url });
        //grace full closing
        return new Promise((resolve, reject) => {
            this._client.on('connect', () => {
                console.log('Connected to NATS');
                resolve();
            });
            this._client.on('error', (err) => {
                reject(err);
            });
        });
    }
}
//singleton instance becuase we are exporting an instance of the class
exports.natsWrapper = new NatsWrapper();
