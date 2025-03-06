import { Subjects } from "./subjects";

export interface TicketUpdatedEvent {  
     // interface for ticket updated event removed the veson
    subject: Subjects.TicketUpdated;
    data: {
        id: string;
        version: number;   
        title: string;
        price: number;
        userId: string;
        orderid?: string;
      };
}