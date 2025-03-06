import nats, { Stan, Message } from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

const stan = nats.connect('ticketing', 'abc', {
    url: 'nats://localhost:4222'
});
console.clear();
stan.on('connect', async() => {
    console.log('Publisher connected to NATS');
    try {
    const publisher = new TicketCreatedPublisher(stan);
     await publisher.publish({
        id: '123',
        title: 'concert',
        price: 27,
        userId: 'abc'
    });
    } catch (err) { 
        console.error(err);
    }
    // const data=JSON.stringify({
    //     id: '123',
    //     title: 'concert',
    //     price: 20
    // });
    // //publishing the event
    // stan.publish('ticket:created', data, () => {
    //     console.log('Event published!');
    // });
});

