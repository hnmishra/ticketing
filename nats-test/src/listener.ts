import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import TicketCreatedListener from './events/ticket-created-listener';


console.clear();
const id = randomBytes(4).toString('hex');  
const stan=nats.connect('ticketing',id,{
    url:'http://localhost:4222'
 });

 stan.on('connect',()=>{  
    console.log('Listener connected to NATS');
//graceful Closing
    stan.on('close',()=>{
        console.log('NATS connection closed!');
        process.exit();
    });
    new TicketCreatedListener(stan).listen();
    });
   //graceful shutdown
   process.on('SIGINT',()=>stan.close());  //watching for interrupt signals
   process.on('SIGTERM',()=>stan.close()); //watching for termination signals

 
  
