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
const common_1 = require("@hnticketing/common");
const nats_wrapper_1 = require("../../../nats-wrapper");
const order_created_listener_1 = require("../order-created-listener");
const order_1 = require("../../../models/order");
const setup = () => __awaiter(void 0, void 0, void 0, function* () {
    const listener = new order_created_listener_1.OrderCreatedListener(nats_wrapper_1.natsWrapper.client);
    const data = {
        id: new mongoose_1.default.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'alskdjf',
        userId: 'alskdjf',
        status: common_1.OrderStatus.Created,
        ticket: {
            id: 'alskdfj',
            price: 10,
        },
    };
    // @ts-ignore
    const msg = {
        ack: jest.fn(),
    };
    return { listener, data, msg };
});
it('replicates the order info', () => __awaiter(void 0, void 0, void 0, function* () {
    const { listener, data, msg } = yield setup();
    yield listener.onMessage(data, msg);
    const order = yield order_1.Order.findById(data.id);
    expect(order.price).toEqual(data.ticket.price);
}));
it('acks the message', () => __awaiter(void 0, void 0, void 0, function* () {
    const { listener, data, msg } = yield setup();
    yield listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
}));
