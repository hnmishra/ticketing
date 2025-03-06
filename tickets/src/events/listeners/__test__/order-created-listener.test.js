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
const ticket_1 = require("../../../models/ticket");
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("@hnticketing/common");
const order_created_listener_1 = require("../order-created-listener");
const setup = () => __awaiter(void 0, void 0, void 0, function* () {
    //craete an instance of the listener
    const listener = new order_created_listener_1.OrderCreatedListener(nats_wrapper_1.natsWrapper.client);
    //create and save a ticket
    const ticket = ticket_1.Ticket.build({
        title: 'concert',
        price: 99,
        userid: new mongoose_1.default.Types.ObjectId().toHexString(),
    });
    yield ticket.save();
    //create a fake data event
    const data = {
        id: new mongoose_1.default.Types.ObjectId().toHexString(),
        version: 0,
        status: common_1.OrderStatus.Created,
        userId: new mongoose_1.default.Types.ObjectId().toHexString(),
        expiresAt: 'fake date',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };
    //create a fake message object
    // @ts-ignore
    const msg = {
        ack: jest.fn()
    };
    //return all of this stuff
    return { listener, ticket, data, msg };
});
it('sets the orderId of the ticket', () => __awaiter(void 0, void 0, void 0, function* () {
    const { listener, ticket, data, msg } = yield setup();
    //call the onMessage function with the data object + message object
    yield listener.onMessage(data, msg);
    //write assertions to make sure a ticket was created
    const updatedTicket = yield ticket_1.Ticket.findById(ticket.id);
    expect(updatedTicket.orderid).toEqual(data.id);
}));
it('publises a ticket updated event', () => __awaiter(void 0, void 0, void 0, function* () {
    const { listener, ticket, data, msg } = yield setup();
    //call the onMessage function with the data object + message object
    yield listener.onMessage(data, msg);
    //write assertions to make sure a ticket was created
    expect(nats_wrapper_1.natsWrapper.client.publish).toHaveBeenCalled();
    // @ts-ingnore
    console.log(nats_wrapper_1.natsWrapper.client.publish.mock.calls);
    const orderid = JSON.parse(nats_wrapper_1.natsWrapper.client.publish.mock.calls[0][1]);
    expect(orderid.orderid).toEqual(data.id);
}));
