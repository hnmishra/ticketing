"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const nats_wrapper_1 = require("./nats-wrapper");
const order_created_listener_1 = require("./events/listeners/order-created-listener");
const order_cancelled_listener_1 = require("./events/listeners/order-cancelled-listener");
//connect to mongo db
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }
    try {
        yield nats_wrapper_1.natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        //graceful shutdown
        nats_wrapper_1.natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });
        //graceful shutdown
        process.on('SIGINT', () => nats_wrapper_1.natsWrapper.client.close()); //watching for interrupt signals
        process.on('SIGTERM', () => nats_wrapper_1.natsWrapper.client.close()); //watching for termination signals
        new order_created_listener_1.OrderCreatedListener(nats_wrapper_1.natsWrapper.client).listen();
        new order_cancelled_listener_1.OrderCancelledListener(nats_wrapper_1.natsWrapper.client).listen();
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('Connected TICKETS to MongoDB');
    }
    catch (err) {
        console.error(err);
    }
    app_1.app.listen(3000, () => {
        console.log('Auth service started on port 3000');
    });
});
start();
