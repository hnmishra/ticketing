import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { OrderStatus } from '@hnticketing/common';
import { requireAuth, 
        validateRequest,
        currentUser,
        NotFoundError,
        NotAuthorizedError,
        BadRequestError
         } from '@hnticketing/common';
import { Order} from '../models/order';
import { Payment } from '../models/payment';
import  { stripe } from '../stripe';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

//import { Payment } from '../models/payment';

const router = express.Router();

router.post(
  '/api/payments', 
    requireAuth,
    currentUser,
    [
        body('token')
        .not()
        .isEmpty(),

        body('orderId')
        .not()
        .isEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;
        const order = await Order.findById(orderId);

        if  (!order) {
            throw new NotFoundError();
        } 
        if (order.userId !== req.currentUser!.email) {
            throw new NotAuthorizedError();
        }
       
        console.log('order status:', order.status, 'order id:', order.id);
        
        if (order.status.toString() === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for an cancelled order');
        }
       const charge= await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,  //conver doller to cents
            source: token
        });
        //save payment
        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        });
        await payment.save();
        //publish event to be listed by the order service
         new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id, 
            orderId: payment.orderId,
            stripeId: payment.stripeId
        });

        res.status(201).send({ id: payment.id });
    }   
);
export { router as createChargeRouter };