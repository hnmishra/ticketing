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
const order_cancelled_listener_1 = require("../order-cancelled-listener");
const nats_wrapper_1 = require("../../../nats-wrapper");
const order_1 = require("../../../models/order");
const setup = () => __awaiter(void 0, void 0, void 0, function* () {
    const listener = new order_cancelled_listener_1.OrderCancelledListener(nats_wrapper_1.natsWrapper.client);
    const order = order_1.Order.build({
        id: new mongoose_1.default.Types.ObjectId().toHexString(),
        status: common_1.OrderStatus.Created,
        price: 10,
        userId: 'asldkfj',
        version: 0,
    });
    yield order.save();
    const data = {
        id: order.id,
        version: 1,
        ticket: {
            id: 'asldkfj',
        },
    };
    // @ts-ignore
    const msg = {
        ack: jest.fn(),
    };
    return { listener, data, msg, order };
});
it('updates the status of the order', () => __awaiter(void 0, void 0, void 0, function* () {
    const { listener, data, msg, order } = yield setup();
    yield listener.onMessage(data, msg);
    const updatedOrder = yield order_1.Order.findById(order.id);
    expect(updatedOrder.status).toEqual(common_1.OrderStatus.Cancelled);
}));
it('acks the message', () => __awaiter(void 0, void 0, void 0, function* () {
    const { listener, data, msg, order } = yield setup();
    yield listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
}));
