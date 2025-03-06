import { Listener,Subjects } from "@hnticketing/common";
import { OrderCreatedEvent } from "@hnticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { TicketCreatedPublisher } from "../publishers/ticket-created-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: OrderCreatedEvent["subject"] = Subjects.OrderCreated;
    queueGroupName = queueGroupName;
    
    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);
    
        // If no ticket, throw error
        if (!ticket) {
        throw new Error("Ticket not found");
        }
     
        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderid: data.id });
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userid,
            orderid: ticket.orderid,
            version: ticket.version,
        });
        
        // Save the ticket

    
        // Ack the message
        msg.ack();
    }
}