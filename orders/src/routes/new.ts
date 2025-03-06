import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
  currentUser
} from '@hnticketing/common';
import { body } from 'express-validator';
import { Ticket } from './models/ticket';
import { Order } from './models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  '/api/orders',
   requireAuth,
   currentUser,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log('User Id in order new', req.currentUser);

    try {
      const { ticketId } = req.body;

      console.log('User Id in order new', req.body.currentUser);
      // Find the ticket the user is trying to order in the database
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new NotFoundError();
      }

       // Make sure that this ticket is not already reserved
      const isReserved = await ticket.isReserved();

      if (isReserved) {
        throw new BadRequestError('Ticket is already reserved');
      }
      // Calculate an expiration date for this order
      const expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
      console.log('Expiration window in order/new.ts', expiration);
      // Build the order and save it to the database
      const order = Order.build({
        userId: req.currentUser!.email,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
      });
      await order.save();

      // Publish an event saying that an order was created
      new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
          id: ticket.id,
          price: ticket.price
        }
      });

      res.status(201).send(order);
//          res.status(201).send('Order Created Called');
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send(error.message);
      } else {
        res.status(400).send('An unknown error occurred');
      }
    }
  }
);
export { router as newOrderRouter };
