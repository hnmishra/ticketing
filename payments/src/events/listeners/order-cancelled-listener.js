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
exports.OrderCancelledListener = void 0;
const common_1 = require("@hnticketing/common");
const order_1 = require("../../models/order");
const queue_group_name_1 = require("./queue-group-name");
const common_2 = require("@hnticketing/common");
class OrderCancelledListener extends common_1.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.OrderCancelled;
        this.queueGroupName = queue_group_name_1.queueGroupName;
    }
    onMessage(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the ticket that the order is reserving
            const order = yield order_1.Order.findOne({
                _id: data.id,
                version: data.version - 1
            });
            // If no ticket, throw error
            if (!order) {
                throw new Error("Order not found");
            }
            // Mark the ticket as being reserved by setting its orderId property
            order.set({ status: common_2.OrderStatus.Cancelled });
            yield order.save();
            // Ack the message
            msg.ack();
        });
    }
}
exports.OrderCancelledListener = OrderCancelledListener;
