import { OrderCreatedEvent } from "@hnticketing/common";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from 'mongoose';
import { OrderStatus } from "@hnticketing/common";
import {OrderCreatedListener} from "../order-created-listener";

const setup = async () => {
    //craete an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);
    //create and save a ticket
    const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userid: new mongoose.Types.ObjectId().toHexString(),
    });

    await ticket.save();

    //create a fake data event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: 'fake date',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };
    //create a fake message object
    // @ts-ignore
    const msg:Message = {
        ack: jest.fn() 
    }; 
    //return all of this stuff
    return { listener, ticket, data, msg };
};

it('sets the orderId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup();
    //call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    //write assertions to make sure a ticket was created
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderid).toEqual(data.id);
});

it('publises a ticket updated event', async () => {
    const { listener, ticket, data, msg } = await setup();
    //call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    //write assertions to make sure a ticket was created
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    // @ts-ingnore
    console.log((natsWrapper.client.publish as jest.Mock).mock.calls);
    const orderid= JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
   // expect(orderid.orderid).toEqual(data.id);

}); 