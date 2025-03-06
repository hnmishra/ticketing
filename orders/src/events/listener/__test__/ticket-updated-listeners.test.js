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
const nats_wrapper_1 = require("../../../nats-wrapper");
const ticket_1 = require("../../../routes/models/ticket");
const mongoose_1 = __importDefault(require("mongoose"));
const ticket_updated_listener_1 = require("../ticket-updated-listener");
const setup = () => __awaiter(void 0, void 0, void 0, function* () {
    //craete an instance of the listener
    const listener = new ticket_updated_listener_1.TicketUpdatedListener(nats_wrapper_1.natsWrapper.client);
    //create and save a ticket
    const ticket = ticket_1.Ticket.build({
        id: new mongoose_1.default.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 99,
    });
    yield ticket.save();
    //create a fake data event
    const data = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'Updated concert',
        price: 999,
        userId: new mongoose_1.default.Types.ObjectId().toHexString(),
    };
    //create a fake message object
    // @ts-ignore  };  
    const msg = {
        ack: jest.fn()
    };
    //return all of this stuff
    return { listener, data, ticket, msg };
});
it('find, update ans save a ticket', () => __awaiter(void 0, void 0, void 0, function* () {
    const { listener, data, ticket, msg } = yield setup();
    //call the onMessage function with the data object + message object
    yield listener.onMessage(data, msg);
    //write assertions to make sure a ticket was created
    const updatedTicket = yield ticket_1.Ticket.findById(ticket.id);
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket.title).toEqual(data.title);
    expect(updatedTicket.price).toEqual(data.price);
    expect(updatedTicket.version).toEqual(data.version);
}));
it('acks the message', () => __awaiter(void 0, void 0, void 0, function* () {
    const { listener, data, ticket, msg } = yield setup();
    //call the onMessage function with the data object + message object
    yield listener.onMessage(data, msg);
    //write assertions to make sure a ticket was created
    expect(msg.ack).toHaveBeenCalled();
    expect(msg.ack).toHaveBeenCalledTimes(1);
}));
it('does not call ack if the event has a skipped version number', () => __awaiter(void 0, void 0, void 0, function* () {
    const { listener, data, ticket, msg } = yield setup();
    data.version = 10;
    try {
        yield listener.onMessage(data, msg);
    }
    catch (err) { }
    expect(msg.ack).not.toHaveBeenCalled();
}));
