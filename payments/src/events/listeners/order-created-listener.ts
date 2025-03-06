import {Listener, 
    OrderCreatedEvent, 
    OrderStatus, 
    Subjects} from '@hnticketing/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: OrderCreatedEvent["subject"] = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message)
    {
        const order = Order.build({
            id: data.id,
            version: data.version,
            status: data.status,
            userId: data.userId,
            price: data.ticket.price
        });
        await order.save();
        
        // Do something
        msg.ack();
    }         
}