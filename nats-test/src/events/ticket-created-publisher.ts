//import  { Publisher }  from './base-publisher';
import { Publisher } from '@hnticketing/common';
//import { Subjects } from './subjects';
import { Subjects } from '@hnticketing/common';
//import { TicketCreatedEvent } from './ticket-created-event';
import { TicketCreatedEvent } from '@hnticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}