import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated; // subject is OrderCreated
    data: { // data is an object with the following properties
        id: string; // order id is a string
        version: number; // version is a number
        status: OrderStatus; // status is a string
        userId: string; // userId is a string
        expiresAt: string; // expiresAt is a string
        ticket: { // ticket is an object with the following properties
            id: string; //tkt id is a string
            price: number; // price is a number
        }
    }
};