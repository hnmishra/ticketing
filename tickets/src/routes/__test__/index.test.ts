import request from 'supertest';
import { app } from '../../app';


it('can fetch a list of tickets', async () => {
    const createTicket = () => {
        return request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({
                title: 'concert',
                price: 20
            });
    };

    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);

    expect(response.body.length).toEqual(3);
});