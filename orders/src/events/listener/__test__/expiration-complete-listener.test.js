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
const expiration_complete_listener_1 = require("../expiration-complete-listener");
const nats_wrapper_1 = require("../../../nats-wrapper");
const order_1 = require("../../../routes/models/order");
const ticket_1 = require("../../../routes/models/ticket");
const setup = () => __awaiter(void 0, void 0, void 0, function* () {
    const listener = new expiration_complete_listener_1.ExpirationCompleteListener(nats_wrapper_1.natsWrapper.client);
    const ticket = ticket_1.Ticket.build({
        id: new mongoose_1.default.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    yield ticket.save();
    const order = order_1.Order.build({
        status: common_1.OrderStatus.Created,
        userId: 'alskdfj',
        expiresAt: new Date(),
        ticket,
    });
    yield order.save();
    const data = {
        orderId: order.id,
    };
    // @ts-ignore
    const msg = {
        ack: jest.fn(),
    };
    return { listener, order, ticket, data, msg };
});
it('updates the order status to cancelled', () => __awaiter(void 0, void 0, void 0, function* () {
    const { listener, order, data, msg } = yield setup();
    yield listener.onMessage(data, msg);
    const updatedOrder = yield order_1.Order.findById(order.id);
    expect(updatedOrder.status).toEqual(common_1.OrderStatus.Cancelled);
}));
it('emit an OrderCancelled event', () => __awaiter(void 0, void 0, void 0, function* () {
    const { listener, order, data, msg } = yield setup();
    yield listener.onMessage(data, msg);
    expect(nats_wrapper_1.natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse(nats_wrapper_1.natsWrapper.client.publish.mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
}));
it('ack the message', () => __awaiter(void 0, void 0, void 0, function* () {
    const { listener, data, msg } = yield setup();
    yield listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
}));
