import dotenv from 'dotenv';
import path from 'path';
import { IConfiguration } from './Configuration';
import { getEnvironmentVariable } from "@suke/suke-util";
import { createClient } from 'redis';
import Redis from 'ioredis';
dotenv.config({
    path: path.resolve(__dirname, "../../server.conf")
});

const redisUrl = getEnvironmentVariable("REDIS_CONNECTION_URI", true) as string;
export const RedisClient = createClient({ url: redisUrl});
export const TempRedisClientForRateLimiter = new Redis(redisUrl);
export type RedisClientType  = typeof RedisClient;

RedisClient.on('error', (err) => console.error('RedisClientError: ', err));

RedisClient.connect().then(() => {
    RedisClient.flushDb()
    .then(() => {
        console.log("Connected to clean redis instance.");
    })
    .catch((err) => {
        console.error(err);
    });
}).catch(err => console.error(err));

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
        saveUninitialized: false,
        secret: getEnvironmentVariable("SESSION_SECRET", false, "GODLYSECRETFORYOU") as string,
        resave: false
    },
    recaptcha : {
        secretKey : getEnvironmentVariable("RECAPTCHA_SECRET_KEY", true) as string
    },
    email : {
        host : getEnvironmentVariable("SMTP_HOST" , true) as string,
        port : parseInt(getEnvironmentVariable("SMTP_PORT" , true)) as number,
        username : getEnvironmentVariable("SMTP_USERNAME",true) as string,
        password : getEnvironmentVariable("SMTP_PASSWORD" , true) as string,
        jwtSecret : getEnvironmentVariable("EMAIL_JWT_SECRET" , true) as string
    }
};

export default config;