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
exports.deleteOrderRouter = void 0;
const express_1 = __importDefault(require("express"));
const order_1 = require("./models/order");
const common_1 = require("@hnticketing/common");
const order_cancelled_publisher_1 = require("../events/publishers/order-cancelled-publisher");
const nats_wrapper_1 = require("../nats-wrapper");
const router = express_1.default.Router();
exports.deleteOrderRouter = router;
router.delete('/api/orders/:orderId', common_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    // Add logic to delete the order by orderId
    const order = yield order_1.Order.findById(orderId).populate('ticket');
    if (!order) {
        throw new common_1.NotFoundError();
    }
    if (order.userId !== req.currentUser.id) {
        throw new common_1.NotAuthorizedError();
    }
    order.status = common_1.OrderStatus.Cancelled;
    yield order.save();
    //  res.send(`Order with id ${orderId} cancelled`);
    res.status(204).send(order);
    //publish an event that the order was cancelled
    new order_cancelled_publisher_1.OrderCancelledPublisher(nats_wrapper_1.natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id,
        },
    });
}));
