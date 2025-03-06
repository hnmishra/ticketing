import { Listener } from "@hnticketing/common";
import { Message } from "node-nats-streaming";
import { Subjects } from "@hnticketing/common";
import { TicketUpdatedEvent } from "@hnticketing/common";
import { Ticket } from "../../routes/models/ticket";
import {queuegroupName} from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject:Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queuegroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {

    const ticket = await Ticket.findByEvent(data);
    // const ticket = await Ticket.findOne({
    //   _id: data.id,
    //   version: data.version - 1,
    // });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}