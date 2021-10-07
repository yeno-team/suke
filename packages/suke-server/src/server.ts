import express from "express";
import { IConfiguration } from "./config/Configuration";
import cors from 'cors';
import { ErrorHandler } from "./middlewares/errorHandler";
import { Container } from "typeorm-typedi-extensions";
import { UserController } from "./controllers/user";
import { UserChannelController } from "./controllers/channel";
import { SocketServer } from "@suke/suke-socket-server/src/server";
import session from 'express-session';
import http from 'http';
export class Server {
    private app;
    private sockerServer: SocketServer;
    private server: http.Server;

    constructor(private config: IConfiguration) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.sockerServer = new SocketServer(this.server, session(config.session));
    }

    private setupControllers(): void {
        const userController = Container.get(UserController);
        userController.execute(this.app);

        const userChannelController = Container.get(UserChannelController);
        userChannelController.execute(this.app);
    }


    public start(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors({origin: "*"}));

        this.setupControllers();

        this.app.use(ErrorHandler);

        // Listening from the socket server will listen on the httpServer that is shared from express.
        this.sockerServer.start(this.config.server.port, () => console.log("Suke Server started listening on PORT " + this.config.server.port));
    }
}