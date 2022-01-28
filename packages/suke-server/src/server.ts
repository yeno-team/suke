import express, { RequestHandler } from "express";
import { IConfiguration } from "./config/Configuration";
import cors from 'cors';
import { ErrorHandler } from "./middlewares/errorHandler";
import { Container } from "typeorm-typedi-extensions";
import controllers from './controllers';
import { SocketServer } from "@suke/suke-socket-server/src/server";
import session from 'express-session';
import http from 'http';
import { IUser, UserModel } from "@suke/suke-core/src/entities/User";
import { RedisClient } from "./config";
import { setGlobalRateLimiter } from "./middlewares/setGlobalRateLimiter";
import { RateLimiterOpts } from "@suke/suke-core/src/entities/RateLimiterOpts";
import handlers from "@suke/suke-socket-server/src/handlers";
import { TypeormStore } from 'connect-typeorm';
import { getRepository } from "typeorm";
import { SessionModel } from '@suke/suke-core/src/entities/Session';

interface ExpressLocals {
    user?: UserModel;
    limiters? : Array<RateLimiterOpts>
}

declare module 'express-session' {
    interface SessionData {
      user: IUser;
    }
}

declare module 'express' {
    interface Response {
        locals: ExpressLocals;
    }
}

export class Server {
    private app;
    private socketServer: SocketServer;
    private server: http.Server;
    private sessionParser: RequestHandler;

    constructor(private config: IConfiguration) {

        this.app = express();
        this.server = http.createServer(this.app);
        this.sessionParser = session({
            store: new TypeormStore({
                cleanupLimit: 2,
                ttl: 86400
            }).connect(getRepository(SessionModel)),
            ...config.session
        });
        this.socketServer = new SocketServer({
            httpServer: this.server, 
            sessionParser: this.sessionParser, 
            redisClient: RedisClient
        });
    }

    private setupControllers(): void {
        controllers.map((controller) => {
            const c = Container.get(controller);
            c.execute(this.app);
        });
    }


    public start(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors({origin: "*"}));
        this.app.use(this.sessionParser);
        this.app.use(setGlobalRateLimiter());

        this.setupControllers();
        this.app.use(ErrorHandler);
        
        // create socket handlers
        for (const createHandler of handlers) {
            createHandler(this.socketServer)();
        }

        // Listening from the socket server will listen on the httpServer that is shared from express.
        this.socketServer.start(this.config.server.port, () => console.log("Suke Server started listening on PORT " + this.config.server.port));
    }
}