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
exports.createTicketRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@hnticketing/common");
const express_validator_1 = require("express-validator");
const common_2 = require("@hnticketing/common");
const ticket_1 = require("../models/ticket");
const ticket_created_publisher_1 = require("../events/publishers/ticket-created-publisher");
const nats_wrapper_1 = require("../nats-wrapper");
const router = express_1.default.Router();
exports.createTicketRouter = router;
router.post('/api/tickets', common_1.requireAuth, common_2.currentUser, [
    (0, express_validator_1.body)('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    (0, express_validator_1.body)('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be greater than 0'),
], common_2.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, price } = req.body;
        console.log("userid in ticket Created!!", req.currentUser);
        const ticket = ticket_1.Ticket.build({
            title,
            price,
            userid: req.currentUser.email,
        });
        yield ticket.save();
        console.log("ticket created", ticket);
        new ticket_created_publisher_1.TicketCreatedPublisher(nats_wrapper_1.natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userid,
            version: ticket.version,
        });
        res.status(201).send(ticket);
    }
    catch (err) {
        console.error(err);
        res.status(400).send({ error: 'Ticket creation failed' });
    }
}));
