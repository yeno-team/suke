import 'reflect-metadata';
import config, { RedisClient, RedisClientType } from './config';
import { Container } from 'typedi';
import { Container as typeORMContainer } from 'typeorm-typedi-extensions';
import { createConnection, getRepository, Not, useContainer } from 'typeorm';
import { Server } from './server';
import { UserModel } from '@suke/suke-core/src/entities/User';
import { UserChannelModel } from '@suke/suke-core/src/entities/UserChannel';
import { SessionModel } from '@suke/suke-core/src/entities/Session';
import { Follower, TheaterItemFollower } from '@suke/suke-core/src/entities/Follower';
import { CategoryModel } from "@suke/suke-core/src/entities/Category";
import { NodeMailerService } from '@suke/suke-server/src/services/nodemailer';
import { EmailModel } from '@suke/suke-core/src/entities/Email';
import cors_proxy from "cors-anywhere";
import { TheaterItemModel } from '@suke/suke-core/src/entities/TheaterItem';
import { TheaterItemScheduleModel } from '@suke/suke-core/src/entities/TheaterItemSchedule';

useContainer(typeORMContainer);

createConnection({
    type: "postgres",
    url: config.db.connectionUri,
    logger: 'advanced-console',
    entities: [
        UserModel, 
        UserChannelModel, 
        SessionModel, 
        Follower, 
        CategoryModel, 
        EmailModel, 
        TheaterItemModel, 
        TheaterItemFollower, 
        TheaterItemScheduleModel
    ],
    synchronize: true,
}).then(async () => {
    Container.set<RedisClientType>('redis', RedisClient);
    Container.set<string>("email_jwt_secret_key" , config.email.jwtSecret);

    const categoryRepository = getRepository(CategoryModel);
    await categoryRepository.update({viewerCount: Not(0)}, {viewerCount: 0});
    console.log("Reset Categories Viewer Counts Successfully.");
    
    const nodeMailerService = new NodeMailerService();
    await nodeMailerService.setTestAccount() , await nodeMailerService.setTransport();
    // const
    // await nodeMailerService.createTransport({
    //     host : config.email.host,
    //     port : config.email.port,
    //     auth : {
    //         user : config.email.username,
    //         pass : config.email.password
    //     },
    //     secure : true
    // });

    Container.set<typeof nodeMailerService>("NodeMailerService", nodeMailerService);
    console.log("Mail server has been initalized.");

    new Server(config)
        .start();
}).catch(error => {
    console.error(`Couldn't connect to the database!`);
    console.error(error);
});

cors_proxy.createServer({
    originWhitelist: [], // WARNING: DO NOT ALLOW ALL ORIGINS IN PRODUCTION
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(config.corsProxy.port, config.server.host, function() {
    console.log('Running CORS Anywhere on ' + config.server.host + ':' + config.corsProxy.port);
});