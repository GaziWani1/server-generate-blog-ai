import { config } from 'dotenv';

config({
  path: `.env`,
});

export const { DB_URI, PORT } = process.env;
