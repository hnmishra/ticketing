import { OrderCancelledEvent } from "@hnticketing/common";
import { Listener,Subjects } from "@hnticketing/common";
import { Message } from "node-nats-streaming";
import Ticket from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: OrderCancelledEvent["subject"] = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    
    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        // Find the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);
    
        // If no ticket, throw error
        if (!ticket) {
        throw new Error("Ticket not found");
        }
     
        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderid: undefined });

        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userid,
            orderid: ticket.orderid,
            version: ticket.version,
        });
        
     
        // Ack the message
        msg.ack();
    }
 
}