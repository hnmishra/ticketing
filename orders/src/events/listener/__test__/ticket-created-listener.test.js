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
const ticket_created_listener_1 = require("../ticket-created-listener");
const nats_wrapper_1 = require("../../../nats-wrapper");
const mongoose_1 = __importDefault(require("mongoose"));
const ticket_1 = require("../../../routes/models/ticket");
const setup = () => __awaiter(void 0, void 0, void 0, function* () {
    //craete an instance of the listener
    const listener = new ticket_created_listener_1.TicketCreatedListener(nats_wrapper_1.natsWrapper.client);
    //create a fake data event
    const data = {
        id: new mongoose_1.default.Types.ObjectId().toHexString(),
        version: 0,
        title: 'concert',
        price: 10,
        userId: new mongoose_1.default.Types.ObjectId().toHexString(),
    };
    //create a fake message object
    // @ts-ignore
    const msg = {
        ack: jest.fn()
    };
    //return all of this stuff
    return { listener, data, msg };
});
it('creates and saves a ticket', () => __awaiter(void 0, void 0, void 0, function* () {
    const { listener, data, msg } = yield setup();
    //call the onMessage function with the data object + message object
    yield listener.onMessage(data, msg);
    //write assertions to make sure a ticket was created
    const ticket = yield ticket_1.Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket.title).toEqual(data.title);
    expect(ticket.price).toEqual(data.price);
}));
it('acks the message', () => __awaiter(void 0, void 0, void 0, function* () {
    const { listener, data, msg } = yield setup();
    //call the onMessage function with the data object + message object
    yield listener.onMessage(data, msg);
    //write assertions to make sure a ticket was created
    expect(msg.ack).toHaveBeenCalled();
    expect(msg.ack).toHaveBeenCalledTimes(1);
}));
