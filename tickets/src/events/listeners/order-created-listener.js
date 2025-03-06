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
exports.OrderCreatedListener = void 0;
const common_1 = require("@hnticketing/common");
const ticket_1 = require("../../models/ticket");
const queue_group_name_1 = require("./queue-group-name");
const ticket_updated_publisher_1 = require("../publishers/ticket-updated-publisher");
class OrderCreatedListener extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.OrderCreated;
        this.queueGroupName = queue_group_name_1.queueGroupName;
    }
    onMessage(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the ticket that the order is reserving
            const ticket = yield ticket_1.Ticket.findById(data.ticket.id);
            // If no ticket, throw error
            if (!ticket) {
                throw new Error("Ticket not found");
            }
            // Mark the ticket as being reserved by setting its orderId property
            ticket.set({ orderid: data.id });
            yield ticket.save();
            yield new ticket_updated_publisher_1.TicketUpdatedPublisher(this.client).publish({
                id: ticket.id,
                title: ticket.title,
                price: ticket.price,
                userId: ticket.userid,
                orderid: ticket.orderid,
                version: ticket.version,
            });
            // Save the ticket
            // Ack the message
            msg.ack();
        });
    }
}
exports.OrderCreatedListener = OrderCreatedListener;
