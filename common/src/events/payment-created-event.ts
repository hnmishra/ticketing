import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface PaymentCreatedEvent {
    subject: Subjects.PaymentCreated;
    data: {
        id: string;
        orderId: string;
        stripeId: string;
    } 
}

