
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from '../../../routes/models/ticket';
import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@hnticketing/common';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedListener } from '../ticket-updated-listener';
const setup = async () => {
//craete an instance of the listener
const listener = new TicketUpdatedListener(natsWrapper.client);
//create and save a ticket
const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 99,
});
await ticket.save()
//create a fake data event
 const data: TicketUpdatedEvent['data'] = {
     id: ticket.id,
     version: ticket.version+1,
     title: 'Updated concert',
     price: 999,
     userId: new mongoose.Types.ObjectId().toHexString(), 
 };
 //create a fake message object
 // @ts-ignore  };  
    const msg: any = {
        ack: jest.fn()
    };
    //return all of this stuff
return { listener, data, ticket, msg };
};

 it('find, update ans save a ticket', async () => {
    const { listener, data, ticket, msg }=await setup();
    //call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    //write assertions to make sure a ticket was created
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
 });

 it('acks the message', async () => {
    const { listener, data, ticket, msg } = await setup();
    //call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    //write assertions to make sure a ticket was created
    expect(msg.ack).toHaveBeenCalled();
    expect(msg.ack).toHaveBeenCalledTimes(1);
}
);
it('does not call ack if the event has a skipped version number', async () => { 
    const { listener, data, ticket, msg } = await setup();
    data.version = 10;
    try {
        await listener.onMessage(data, msg);
    } catch (err) {}
    expect(msg.ack).not.toHaveBeenCalled();

});
