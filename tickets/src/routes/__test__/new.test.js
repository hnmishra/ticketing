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
const ticket_1 = require("../../models/ticket");
jest.mock('../../nats-wrapper');
it('has a route handler listening to /api/tickets for post requests', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, supertest_1.default)(app_1.app).post('/api/tickets').send({}).expect(401);
}));
it('can only be accessed if the user is signed in', () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.app).post('/api/tickets').send({}).expect(401);
}));
it('returns a status other than 401 if the user is signed in', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, supertest_1.default)(app_1.app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({});
    expect(response.status).not.toEqual(401);
}));
it('returns an error if an invalid title is provided', () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
        "title": '',
        "price": 10
    })
        .expect(400);
}));
it('returns an error if an invalid price is provided', () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, supertest_1.default)(app_1.app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
        "title": 'adbd',
        "price": -10
    })
        .expect(400);
}));
it('creates a ticket with valid inputs', () => __awaiter(void 0, void 0, void 0, function* () {
    let tickets = yield ticket_1.Ticket.find({});
    expect(tickets.length).toEqual(0);
    yield (0, supertest_1.default)(app_1.app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
        title: 'adbd',
        price: 10,
    })
        .expect(201);
    tickets = yield ticket_1.Ticket.find({});
    expect(tickets.length).toEqual(1);
}));
