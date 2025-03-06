import { Publisher, Subjects, TicketUpdatedEvent } from '@hnticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> { 
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
   
};