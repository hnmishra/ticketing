import { Subjects  } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {
        id: string;    //order id is a string
        version: number; //order version is a number
        ticket: {
            id: string; //ticket id is a string
        }
    }
};