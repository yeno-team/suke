import 'reflect-metadata';
import config, { RedisClient } from './config';
import { Container } from 'typedi';
import { Container as typeORMContainer } from 'typeorm-typedi-extensions';
import { createConnection, useContainer } from 'typeorm';
import { Server } from './server';
import { UserModel } from '@suke/suke-core/src/entities/User';
import { UserChannelModel } from '@suke/suke-core/src/entities/UserChannel';
import redis from 'redis';
import { SessionModel } from '@suke/suke-core/src/entities/Session';
import { Follower } from '@suke/suke-core/src/entities/Follower';

useContainer(typeORMContainer);

createConnection({
    type: "postgres",
    url: config.db.connectionUri,
    logger: 'advanced-console',
    entities: [UserModel, UserChannelModel, SessionModel, Follower],
    synchronize: true,
}).then(() => {
    Container.set<redis.RedisClientType>('redis', RedisClient);
    console.log("Connected to DB instance.");

    new Server(config)
        .start();
}).catch(error => {
    console.error(`Couldn't connect to the database!`);
    console.error(error);
});