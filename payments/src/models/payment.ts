import mangoos from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface PaymentAttrs {
    orderId: string;
    stripeId: string;
}

interface PaymentDoc extends mangoos.Document {
    orderId: string;
    stripeId: string;
    // status: PaymentStatus;
    // version: number;
}

interface PaymentModel extends mangoos.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mangoos.Schema({
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
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
};

const Payment = mangoos.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };
