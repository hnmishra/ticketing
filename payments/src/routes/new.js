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
exports.createChargeRouter = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const common_1 = require("@hnticketing/common");
const common_2 = require("@hnticketing/common");
const order_1 = require("../models/order");
const payment_1 = require("../models/payment");
const stripe_1 = require("../stripe");
const payment_created_publisher_1 = require("../events/publishers/payment-created-publisher");
const nats_wrapper_1 = require("../nats-wrapper");
//import { Payment } from '../models/payment';
const router = express_1.default.Router();
exports.createChargeRouter = router;
router.post('/api/payments', common_2.requireAuth, common_2.currentUser, [
    (0, express_validator_1.body)('token')
        .not()
        .isEmpty(),
    (0, express_validator_1.body)('orderId')
        .not()
        .isEmpty()
], common_2.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, orderId } = req.body;
    const order = yield order_1.Order.findById(orderId);
    if (!order) {
        throw new common_2.NotFoundError();
    }
    if (order.userId !== req.currentUser.email) {
        throw new common_2.NotAuthorizedError();
    }
    if (order.status.toString() === common_1.OrderStatus.Cancelled) {
        throw new common_2.BadRequestError('Cannot pay for an cancelled order');
    }
    const charge = yield stripe_1.stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100, //conver doller to cents
        source: token
    });
    //save payment
    const payment = payment_1.Payment.build({
        orderId,
        stripeId: charge.id
    });
    yield payment.save();
    //publish event to be listed by the order service
    new payment_created_publisher_1.PaymentCreatedPublisher(nats_wrapper_1.natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    });
    res.status(201).send({ id: payment.id });
}));
