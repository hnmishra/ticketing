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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
const ticket_1 = require("../models/ticket");
const order_1 = require("../models/order");
const nats_wrapper_1 = require("../../nats-wrapper");
it('marks an order as cancelled', () => __awaiter(void 0, void 0, void 0, function* () {
    // create a ticket with Ticket Model
    const ticket = ticket_1.Ticket.build({
        id: new mongoose_1.default.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    yield ticket.save();
    const user = global.signin();
    // make a request to create an order
    const { body: order } = yield (0, supertest_1.default)(app_1.app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    // make a request to cancel the order
    yield (0, supertest_1.default)(app_1.app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);
    // expectation to make sure the thing is cancelled
    const updatedOrder = yield order_1.Order.findById(order.id);
    expect(updatedOrder.status).toEqual(order_1.OrderStatus.Cancelled);
}));
it('emits a order cancelled event', () => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = ticket_1.Ticket.build({
        id: new mongoose_1.default.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    yield ticket.save();
    const user = global.signin();
    // make a request to create an order
    const { body: order } = yield (0, supertest_1.default)(app_1.app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    // make a request to cancel the order
    yield (0, supertest_1.default)(app_1.app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);
    expect(nats_wrapper_1.natsWrapper.client.publish).toHaveBeenCalled();
}));
