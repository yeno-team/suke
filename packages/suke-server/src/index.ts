import 'reflect-metadata';
import config, { RedisClient, RedisClientType, RedisPubClient } from './config';
import { Container } from 'typedi';
import { Container as typeORMContainer } from 'typeorm-typedi-extensions';
import { createConnection, getRepository, Not, useContainer } from 'typeorm';
import { Server } from './server';
import { User, UserModel } from '@suke/suke-core/src/entities/User';
import { IUserChannel, UserChannelModel } from '@suke/suke-core/src/entities/UserChannel';
import { SessionModel } from '@suke/suke-core/src/entities/Session';
import { Follower, TheaterItemFollower } from '@suke/suke-core/src/entities/Follower';
import { CategoryModel } from "@suke/suke-core/src/entities/Category";
import { NodeMailerService } from '@suke/suke-server/src/services/nodemailer';
import { Email, EmailModel } from '@suke/suke-core/src/entities/Email';
import { TheaterItemModel } from '@suke/suke-core/src/entities/TheaterItem';
import { TheaterItemScheduleModel } from '@suke/suke-core/src/entities/TheaterItemSchedule';
import { startScheduler } from "@suke/suke-scheduler/src";
import { UserService } from '@suke/suke-server/src/services/user';
import { Role } from '@suke/suke-core/src/Role';
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
    Container.set<RedisClientType>('pubredis', RedisPubClient);
    Container.set<string>("email_jwt_secret_key" , config.email.jwtSecret);

    const categoryRepository = getRepository(CategoryModel);
    const theaterItemRepo = getRepository(TheaterItemModel);
    await categoryRepository.update({viewerCount: Not(0)}, {viewerCount: 0});
    await theaterItemRepo.update({viewerCount: Not(0)}, {viewerCount: 0});
    
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

    startScheduler();
    console.log("Scheduler Started.");

    const userService = Container.get(UserService);
    if (await userService.findByName('admin') == null) {
        userService.create(new User({
            name: 'admin',
            email: 'admin@suke.app',
            isVerified: true,
            following: [],
            role: Role.Admin,
            channel: {} as IUserChannel,
            id: 0
        }), new Email('admin@suke.app'), config.db.defaultAdminPassword);
        console.log("Created Default Admin User");
    }

    new Server(config)
        .start();
}).catch(error => {
    console.error(`Couldn't connect to the database!`);
    console.error(error);
});