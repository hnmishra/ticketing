import express from 'express';
import 'express-async-errors' 
import { json } from 'body-parser';
import { errorHandler } from '@hnticketing/common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { NotFoundError } from '@hnticketing/common';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true); //trust the ingress-nginx
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true
}));

//routers
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.get('*', async(req,res ) => {   
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };