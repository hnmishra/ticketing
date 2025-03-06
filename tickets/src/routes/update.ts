import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError, BadRequestError } from '@hnticketing/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();


router.put(
    '/api/tickets/:id',
    requireAuth,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new BadRequestError('Invalid ticket ID');
        }

        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            throw new NotFoundError();
        }
        //if the ticket is reserved, it cannot be edited
        if (ticket.orderid) {
            throw new BadRequestError('Cannot edit a reserved ticket');
        }
        // if (ticket.userid !== req.currentUser!.id) {
        //     throw new NotAuthorizedError();
        // }

        ticket.set({
            title,
            price
        });


        await ticket.save();
        new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userid,
            version: ticket.version,
        });
        res.send(ticket);
    }
);

export { router as updateTicketRouter };