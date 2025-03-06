import express, {Request,Response} from "express";
import {Order} from "./models/order";
import {NotFoundError,OrderStatus,requireAuth,NotAuthorizedError} from "@hnticketing/common";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();
router.delete('/api/orders/:orderId', 
    requireAuth,
    async (req: Request, res: Response) => {
    const { orderId } = req.params;
    // Add logic to delete the order by orderId
    const order= await Order.findById(orderId).populate('ticket');
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
  //  res.send(`Order with id ${orderId} cancelled`);
    res.status(204).send(order);
    //publish an event that the order was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id,
        },
    });

});

export  {router as deleteOrderRouter}; 