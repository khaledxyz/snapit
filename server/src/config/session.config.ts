import session, { SessionOptions } from 'express-session';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';

// Initialize Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});
redisClient.connect().catch(console.error);

// Initialize Redis store
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'snapit:sess:',
});

export const sessionConfig: SessionOptions = {
  secret: process.env.APP_SECRET as string,
  resave: false,
  saveUninitialized: false,
  store: redisStore,
  cookie: {
    domain: process.env.APP_DOMAIN,
    secure: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
};
