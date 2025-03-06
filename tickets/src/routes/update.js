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
exports.updateTicketRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("@hnticketing/common");
const ticket_1 = require("../models/ticket");
const ticket_updated_publisher_1 = require("../events/publishers/ticket-updated-publisher");
const nats_wrapper_1 = require("../nats-wrapper");
const router = express_1.default.Router();
exports.updateTicketRouter = router;
router.put('/api/tickets/:id', common_1.requireAuth, [
    (0, express_validator_1.body)('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    (0, express_validator_1.body)('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be greater than 0')
], common_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, price } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
        throw new common_1.BadRequestError('Invalid ticket ID');
    }
    const ticket = yield ticket_1.Ticket.findById(req.params.id);
    if (!ticket) {
        throw new common_1.NotFoundError();
    }
    //if the ticket is reserved, it cannot be edited
    if (ticket.orderid) {
        throw new common_1.BadRequestError('Cannot edit a reserved ticket');
    }
    // if (ticket.userid !== req.currentUser!.id) {
    //     throw new NotAuthorizedError();
    // }
    ticket.set({
        title,
        price
    });
    yield ticket.save();
    new ticket_updated_publisher_1.TicketUpdatedPublisher(nats_wrapper_1.natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userid,
        version: ticket.version,
    });
    res.send(ticket);
}));
