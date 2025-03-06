import { Listener } from "@hnticketing/common";
import { Message } from "node-nats-streaming";
import { Subjects } from "@hnticketing/common";
import { TicketCreatedEvent } from "@hnticketing/common";
import { Ticket } from "../../routes/models/ticket";
import {queuegroupName} from "./queue-group-name";



export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject:Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queuegroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id,title, price } = data;
    const ticket = Ticket.build({
      id, 
      title,
      price
     });
    await ticket.save();

    msg.ack();
  }
}

