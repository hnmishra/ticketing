import { OrderCancelledListener } from "../order-cancelled-listener";
import { OrderCancelledEvent } from "@hnticketing/common";
import { Listener,Subjects } from "@hnticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from 'mongoose';

const setup = async () => {
    //craete an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);
    //create and save a ticket
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userid: new mongoose.Types.ObjectId().toHexString(),
    });
    ticket.set({orderId});
    await ticket.save();
    
    const data: OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {   
            id: ticket.id,
        }
    }
    // @ts-ignore
    const msg: Message = { 
        ack: jest.fn()
     } ;
    return { msg,data,ticket,orderId };
};

it('updates the ticket, publishes an event, and acks the message', async () => {
    const { msg, data, ticket, orderId } = await setup();
    const listener = new OrderCancelledListener(natsWrapper.client);
    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderid).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(ticketUpdatedData.orderid).not.toBeDefined();
});