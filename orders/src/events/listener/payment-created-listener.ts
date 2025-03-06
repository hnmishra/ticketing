import { Subjects } from "@hnticketing/common";
import { Listener, PaymentCreatedEvent, OrderStatus } from "@hnticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../routes/models/order";
import { queuegroupName } from "./queue-group-name";
export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName = queuegroupName;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {

        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error('Order not found');
        }
        
        order.set({
            status: OrderStatus.Complete
        });
        await order.save();
        
        msg.ack();
    }
}