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
exports.newOrderRouter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const common_1 = require("@hnticketing/common");
const express_validator_1 = require("express-validator");
const ticket_1 = require("./models/ticket");
const order_1 = require("./models/order");
const order_created_publisher_1 = require("../events/publishers/order-created-publisher");
const nats_wrapper_1 = require("../nats-wrapper");
const router = express_1.default.Router();
exports.newOrderRouter = router;
const EXPIRATION_WINDOW_SECONDS = 1 * 60;
router.post('/api/orders', common_1.requireAuth, common_1.currentUser, [
    (0, express_validator_1.body)('ticketId')
        .not()
        .isEmpty()
        .custom((input) => mongoose_1.default.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided')
], common_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('User Id in order new', req.currentUser);
    try {
        const { ticketId } = req.body;
        console.log('User Id in order new', req.body.currentUser);
        // Find the ticket the user is trying to order in the database
        const ticket = yield ticket_1.Ticket.findById(ticketId);
        if (!ticket) {
            throw new common_1.NotFoundError();
        }
        // Make sure that this ticket is not already reserved
        const isReserved = yield ticket.isReserved();
        if (isReserved) {
            throw new common_1.BadRequestError('Ticket is already reserved');
        }
        // Calculate an expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
        console.log('Expiration window in order/new.ts', expiration);
        // Build the order and save it to the database
        const order = order_1.Order.build({
            userId: req.currentUser.email,
            status: common_1.OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });
        yield order.save();
        // Publish an event saying that an order was created
        new order_created_publisher_1.OrderCreatedPublisher(nats_wrapper_1.natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        });
        res.status(201).send(order);
        //          res.status(201).send('Order Created Called');
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        }
        else {
            res.status(400).send('An unknown error occurred');
        }
    }
}));
