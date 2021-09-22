import 'reflect-metadata';
import config from './config'
import { Container } from 'typeorm-typedi-extensions';
import { createConnection, useContainer } from 'typeorm';
import { Server } from './server';
import { UserModel } from 'packages/suke-core/src/entities/User';

useContainer(Container);

createConnection({
    type: "postgres",
    url: config.db.connectionUri,
    logger: 'advanced-console',
    entities: [UserModel]
}).catch(error => {
    console.error(`Couldn't connect to the database!`);
    console.error(error);
});

new Server(config).start();