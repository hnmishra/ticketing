import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An interface that describes the properties
// that are required to create a new Ticket
interface TicketAttrs {
    title: string;
    price: number;
    userid: string;

}

// An interface that describes the properties
// that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

// An interface that describes the properties
// that a Ticket Document has
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userid: string;
    version: number;
    orderid?: string;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,  //specific to mongose not typescript. String is a constructor function
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
    },
    {
        toJSON: {
            transform(doc:any, ret)  {
                ret.id = ret._id;
                delete ret._id;
                // delete ret.__v;
                }
            }
        }  

    );

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);
export { Ticket };



//  const Ticket = Ticket.build({
//     title: 'liveshow',
//     price: '$100',
//     userid: 'hnm'
//  });
export default Ticket;