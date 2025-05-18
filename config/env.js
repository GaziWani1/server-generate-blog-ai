import { config } from 'dotenv';

config({
  path: `.env`,
});

export const { DB_URI, PORT, API_KEY, STRIPE_SECRET_KEY } = process.env;
