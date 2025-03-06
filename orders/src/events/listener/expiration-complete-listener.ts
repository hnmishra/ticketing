import { ExpirationCompleteEvent } from "@hnticketing/common";
import { Subjects } from "@hnticketing/common";
import { Listener } from "@hnticketing/common";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../routes/models/order";
import { queuegroupName } from "./queue-group-name";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
    queueGroupName: string = queuegroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message): Promise<void> {
        const order = await Order.findById(data.orderId).populate("ticket");
     
        if (!order) {
            throw new Error("Order not found");
        }
        //do not cancel the order if it is already completed
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({ status: OrderStatus.Cancelled });

        await order.save();
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
            },
        });
        msg.ack();
    }
}