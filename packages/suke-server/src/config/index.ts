import dotenv from 'dotenv';
import path from 'path';
import { IConfiguration } from './Configuration';
import { getEnvironmentVariable } from '@suke/suke-util'
import connectRedis from 'connect-redis';
import session from 'express-session';
import redis from 'redis';

dotenv.config({
    path: path.resolve(__dirname, "../../server.conf")
});

const RedisStore = connectRedis(session);
export const RedisClient = redis.createClient({
    url: getEnvironmentVariable("REDIS_CONNECTION_URI", true) as string,
    enable_offline_queue : false
});

const config: IConfiguration = {
    server: {
        port: parseInt(getEnvironmentVariable("PORT", false, "3000") as string)
    },
    db: {
        connectionUri: getEnvironmentVariable("DB_CONNECTION_URI", true) as string
    },
    redis: {
        connectionUri: getEnvironmentVariable("REDIS_CONNECTION_URI", true) as string
    },
    session: {
        store: new RedisStore({client: RedisClient}),
        saveUninitialized: false,
        secret: getEnvironmentVariable("SESSION_SECRET", false, "GODLYSECRETFORYOU") as string,
        resave: false
    },
    recaptcha : {
        secretKey : getEnvironmentVariable("RECAPTCHA_SECRET_KEy" , true) as string,
        siteKey : getEnvironmentVariable("RECAPTCHA_SITE_KEY" , true) as string
    }
}

export default config;