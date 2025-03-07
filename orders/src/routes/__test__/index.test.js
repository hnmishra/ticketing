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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
const ticket_1 = require("../models/ticket");
const mongoose_1 = __importDefault(require("mongoose"));
const buildTicket = () => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = ticket_1.Ticket.build({
        id: new mongoose_1.default.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    yield ticket.save();
    return ticket;
});
it('fetches orders for an particular user', () => __awaiter(void 0, void 0, void 0, function* () {
    // Create three tickets
    const ticketOne = yield buildTicket();
    const ticketTwo = yield buildTicket();
    const ticketThree = yield buildTicket();
    const userOne = global.signin();
    const userTwo = global.signin();
    // Create one order as User #1
    yield (0, supertest_1.default)(app_1.app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201);
    // Create two orders as User #2
    const { body: orderOne } = yield (0, supertest_1.default)(app_1.app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201);
    const { body: orderTwo } = yield (0, supertest_1.default)(app_1.app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201);
    // Make request to get orders for User #2
    const response = yield (0, supertest_1.default)(app_1.app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);
    // Make sure we only got the orders for User #2
    //expect(response.body.length).toEqual(2);
    // expect(response.body[0].id).toEqual(orderOne.id);
    // expect(response.body[1].id).toEqual(orderTwo.id);
    // expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    // expect(response.body[1].ticket.id).toEqual(ticketThree.id);
}));
