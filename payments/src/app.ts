import express from 'express';
import 'express-async-errors' ;
import { json } from 'body-parser';
import { errorHandler, requireAuth } from '@hnticketing/common';
import { NotFoundError,currentUser } from '@hnticketing/common';
import { createChargeRouter } from './routes/new';


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
app.use(createChargeRouter);

app.all('*', async(req,res ) => {   
    throw new NotFoundError();
});
app.use(errorHandler);

export { app };