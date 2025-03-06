import express from 'express';
import 'express-async-errors' ;
import { json } from 'body-parser';
import { errorHandler, requireAuth } from '@hnticketing/common';
import { NotFoundError,currentUser } from '@hnticketing/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';


import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true); //trust the ingress-nginx
app.use(json());
//cookie session needs to run first before other middlewares
app.use(cookieSession({
    signed: false,
    secure: true
}));
app.use(currentUser);
//app.use(requireAuth);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async(req,res ) => {   
    throw new NotFoundError();
});
app.use(errorHandler);

export { app };