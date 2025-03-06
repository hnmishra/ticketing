"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const paymentSchema = new mongoose_1.default.Schema({
    orderId: {
        type: String,
        required: true
    },
    stripeId: {
        type: String,
        required: true
    },
    // status: {
    //     type: String,
    //     required: true,
    //     enum: Object.values(PaymentStatus),
    //     default: PaymentStatus.Created
    // }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});
paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
paymentSchema.statics.build = (attrs) => {
    return new Payment(attrs);
};
const Payment = mongoose_1.default.model('Payment', paymentSchema);
exports.Payment = Payment;
