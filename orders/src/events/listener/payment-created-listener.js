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
exports.PaymentCreatedListener = void 0;
const common_1 = require("@hnticketing/common");
const common_2 = require("@hnticketing/common");
const order_1 = require("../../routes/models/order");
const queue_group_name_1 = require("./queue-group-name");
class PaymentCreatedListener extends common_2.Listener {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subjects.PaymentCreated;
        this.queueGroupName = queue_group_name_1.queuegroupName;
    }
    onMessage(data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield order_1.Order.findById(data.orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            order.set({
                status: common_2.OrderStatus.Complete
            });
            yield order.save();
            msg.ack();
        });
    }
}
exports.PaymentCreatedListener = PaymentCreatedListener;
