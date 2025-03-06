"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_update_if_current_1 = require("mongoose-update-if-current");
const ticketSchema = new mongoose_1.default.Schema({
    title: {
        type: String, //specific to mongose not typescript. String is a constructor function
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    userid: {
        type: String,
        required: true,
    },
    orderid: {
        type: String,
        required: false,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            // delete ret.__v;
        }
    }
});
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(mongoose_update_if_current_1.updateIfCurrentPlugin);
ticketSchema.statics.build = (attrs) => {
    return new Ticket(attrs);
};
const Ticket = mongoose_1.default.model('Ticket', ticketSchema);
exports.Ticket = Ticket;
//  const Ticket = Ticket.build({
//     title: 'liveshow',
//     price: '$100',
//     userid: 'hnm'
//  });
exports.default = Ticket;
