import { Publisher, Subjects,  OrderCancelledEvent } from "@hnticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> { 
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    
};