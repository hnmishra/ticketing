"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.OrderStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("@hnticketing/common");
Object.defineProperty(exports, "OrderStatus", { enumerable: true, get: function () { return common_1.OrderStatus; } });
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const orderSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(common_1.OrderStatus),
        default: common_1.OrderStatus.Created,
    },
    expiresAt: {
        type: mongoose_1.default.Schema.Types.Date,
    },
    ticket: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Ticket',
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
orderSchema.set('versionKey', 'version');
orderSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
orderSchema.statics.build = (attrs) => {
    return new Order(attrs);
};
const Order = mongoose_1.default.model('Order', orderSchema);
exports.Order = Order;
