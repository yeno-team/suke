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
import { ILogger } from "@suke/logger";
interface ExpressLocals {
    user?: UserModel;
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
    private sockerServer: SocketServer;
    private server: http.Server;
    private sessionParser: RequestHandler;

    constructor(private config: IConfiguration, private logger: ILogger) {

        this.app = express();
        this.server = http.createServer(this.app);
        this.sessionParser = session(config.session);
        this.sockerServer = new SocketServer(this.server, this.sessionParser);
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

        this.setupControllers();

        this.app.use(ErrorHandler);

        // Listening from the socket server will listen on the httpServer that is shared from express.
        this.sockerServer.start(this.config.server.port, () => this.logger.log("Suke Server started listening on PORT " + this.config.server.port));
    }
}