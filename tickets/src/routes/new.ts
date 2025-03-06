import { Request, Response } from 'express';
import express from 'express';
import {requireAuth} from '@hnticketing/common';
import { body } from 'express-validator';
import { validateRequest,currentUser } from '@hnticketing/common'
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/tickets',
    requireAuth,
    currentUser,
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            const { title, price } = req.body;
            console.log("userid in ticket Created!!", req.currentUser)
            const ticket = Ticket.build({
                title,
                price,
                userid: req.currentUser!.email,
            });

            await ticket.save();

            console.log("ticket created", ticket)
            new TicketCreatedPublisher(natsWrapper.client).publish({
                id: ticket.id,
                title: ticket.title,
                price: ticket.price,
                userId: ticket.userid,
                version: ticket.version,
            });
            res.status(201).send(ticket);
        } catch (err) {
            console.error(err);
            res.status(400).send({ error: 'Ticket creation failed' });
        }
    }
);
export { router as createTicketRouter };
