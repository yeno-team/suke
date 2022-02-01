import 'reflect-metadata';
import config, { RedisClient, RedisClientType } from './config';
import { Container } from 'typedi';
import { Container as typeORMContainer } from 'typeorm-typedi-extensions';
import { createConnection, getRepository, Not, useContainer } from 'typeorm';
import { Server } from './server';
import { UserModel } from '@suke/suke-core/src/entities/User';
import { UserChannelModel } from '@suke/suke-core/src/entities/UserChannel';
import { SessionModel } from '@suke/suke-core/src/entities/Session';
import { Follower } from '@suke/suke-core/src/entities/Follower';
import { CategoryModel } from "@suke/suke-core/src/entities/Category";
import { MailServerService } from '@suke/suke-server/src/services/mailServer';
import { EmailModel } from '@suke/suke-core/src/entities/Email';

useContainer(typeORMContainer);

createConnection({
    type: "postgres",
    url: config.db.connectionUri,
    logger: 'advanced-console',
    entities: [UserModel, UserChannelModel, SessionModel, Follower, CategoryModel , EmailModel],
    synchronize: true,
}).then(async () => {
    Container.set<RedisClientType>('redis', RedisClient);
    console.log("Connected to DB instance.");

    const categoryRepository = getRepository(CategoryModel);
    await categoryRepository.update({viewerCount: Not(0)}, {viewerCount: 0});
    console.log("Reset Categories Viewer Counts Successfully.");
    
    const mailServer = new MailServerService();
    await mailServer.createTransport({
        host : "smtp.ethereal.email",
        port : 587,
        secure : false
    });

    Container.set<typeof mailServer>("mailServer", mailServer);
    console.log("Mail server has been initalized.");


    new Server(config)
        .start();
}).catch(error => {
    console.error(`Couldn't connect to the database!`);
    console.error(error);
});