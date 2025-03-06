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
exports.Ticket = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_1 = require("./order");
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const ticketSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
//if want to update teh version manually
// ticketSchema.pre('save', function (done) {
//   this.$where = {
//     version: this.get('version') - 1,
//   }
//   done();
// });
ticketSchema.statics.findByEvent = (event) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};
ticketSchema.statics.build = (attrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price,
    });
};
ticketSchema.methods.isReserved = function () {
    return __awaiter(this, void 0, void 0, function* () {
        // this === the ticket document that we just called 'isReserved' on
        const existingOrder = yield order_1.Order.findOne({
            ticket: this,
            status: {
                $in: [
                    order_1.OrderStatus.Created,
                    order_1.OrderStatus.AwaitingPayment,
                    order_1.OrderStatus.Complete,
                ],
            },
        });
        return !!existingOrder;
    });
};
const Ticket = mongoose_1.default.model('Ticket', ticketSchema);
exports.Ticket = Ticket;
