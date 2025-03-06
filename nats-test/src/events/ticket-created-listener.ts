import { Message } from 'node-nats-streaming';
//import {Listener} from './base-listener';
import {Listener} from '@hnticketing/common';
//import { Subjects } from './subjects';
import { Subjects } from '@hnticketing/common';
//import { TicketCreatedEvent } from './ticket-created-event';
import { TicketCreatedEvent } from '@hnticketing/common';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject:Subjects.TicketCreated=Subjects.TicketCreated
   
    queueGroupName = 'payments-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data!', data);
        msg.ack();
        
    }
}

export default TicketCreatedListener;