import { Publisher, Subjects,  OrderCreatedEvent} from "@hnticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> { 
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    
};