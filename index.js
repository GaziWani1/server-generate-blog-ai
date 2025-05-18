import express from 'express';
import errorMiddleware from './middleware/error.middleware.js';
import { connectDb } from './db/mongodb.js';
import { PORT, STRIPE_SECRET_KEY } from './config/env.js';
// import cluster from 'cluster';
// import { availableParallelism } from 'node:os';
import cors from 'cors';
import userRouter from './route/user.route.js';
import storyRouter from './route/storeis.route.js';
import './jobs/renewCred.js';

import subscriptionRouter from './route/subscription.route.js';

const app = express();

connectDb();

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/blog', storyRouter);
app.use('/api/v1/subscription', subscriptionRouter);

app.listen(PORT, () => {
  console.log(`App is Running on Port http://localhost:${PORT}`);
});
