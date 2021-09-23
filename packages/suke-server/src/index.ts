import 'reflect-metadata';
import config from './config'
import { Container } from 'typeorm-typedi-extensions';
import { createConnection, useContainer } from 'typeorm';
import { Server } from './server';
import { UserModel } from '@suke/suke-core/src/entities/User';

useContainer(Container);

createConnection({
    type: "postgres",
    url: config.db.connectionUri,
    logger: 'advanced-console',
    entities: [UserModel],
    synchronize: true,
}).then(() => {
    new Server(config).start();
}).catch(error => {
    console.error(`Couldn't connect to the database!`);
    console.error(error);
});

