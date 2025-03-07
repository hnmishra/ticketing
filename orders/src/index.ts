import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listener/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listener/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listener/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listener/payment-created-listener";
//connect to mongo db
const start = async () => {
    console.log('Starting Orders service !!!#');
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        //graceful shutdown
        natsWrapper.client.on('close',()=>{
            console.log('NATS connection closed!');
            process.exit();
        });
         //graceful shutdown
            process.on('SIGINT',()=>natsWrapper.client.close());  //watching for interrupt signals
            process.on('SIGTERM',()=>natsWrapper.client.close()); //watching for termination signals

           new TicketCreatedListener(natsWrapper.client).listen();
           new TicketUpdatedListener(natsWrapper.client).listen();
           new ExpirationCompleteListener(natsWrapper.client).listen();
           new PaymentCreatedListener(natsWrapper.client).listen();
           
           await mongoose.connect(process.env.MONGO_URI);

        console.log('Connected Orders to MongoDB');
    } catch (err) {
        console.error(err);
    }
    app.listen(3000, () => {
        console.log('Auth service started on port 3000');
    });
};
start();

