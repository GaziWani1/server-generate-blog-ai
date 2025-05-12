import express from 'express';
import errorMiddleware from './middleware/error.middleware.js';
import { connectDb } from './db/mongodb.js';
import { PORT } from './config/env.js';
import cluster from 'cluster';
import { availableParallelism } from 'node:os';
import cors from 'cors';
import userRouter from './route/user.route.js';
import storyRouter from './route/storeis.route.js';
const app = express();

connectDb();

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const numCPUs = availableParallelism();

app.use('/api/v1/users', userRouter);
app.use('/api/v1/blog', storyRouter);

app.use(errorMiddleware);
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`App is Running on Port http://localhost:${PORT}`);
  });
}
