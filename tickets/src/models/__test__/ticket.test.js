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
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_1 = require("../ticket");
it('implements optimistic concurrency control', () => __awaiter(void 0, void 0, void 0, function* () {
    // Create an instance of a ticket
    const ticket = ticket_1.Ticket.build({
        title: 'concert',
        price: 5,
        userid: '123'
    });
    // Save the ticket to the database
    yield ticket.save();
    // Fetch the ticket twice
    const firstInstance = yield ticket_1.Ticket.findById(ticket.id);
    const secondInstance = yield ticket_1.Ticket.findById(ticket.id);
    // Make two separate changes to the tickets we fetched
    firstInstance.set({ price: 10 });
    secondInstance.set({ price: 15 });
    // Save the first fetched ticket
    yield firstInstance.save();
    // Save the second fetched ticket and expect an error
    try {
        yield secondInstance.save();
    }
    catch (err) {
        return;
    }
    throw new Error('Should not reach this point');
}));
it('increments the version number on multiple saves', () => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = ticket_1.Ticket.build({
        title: 'concert',
        price: 20,
        userid: '123'
    });
    yield ticket.save();
    expect(ticket.version).toEqual(0);
    yield ticket.save();
    expect(ticket.version).toEqual(1);
    yield ticket.save();
    expect(ticket.version).toEqual(2);
}));
