import express from "express";
import { IConfiguration } from "./config/Configuration";
import cors from 'cors';
import { ErrorHandler } from "./middlewares/errorHandler";
import { Container } from "typeorm-typedi-extensions";
import { UserController } from "./controllers/user";
import { UserChannelController } from "./controllers/channel";
import { Connection } from "typeorm";
import { IRateLimiterStoreOptions, RateLimiterPostgres } from "rate-limiter-flexible";

export class Server {
    private app;

    constructor(private config: IConfiguration) {
        this.app = express();
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

        this.app.listen(this.config.server.port, () => console.log("Suke Server started listening on PORT " + this.config.server.port));
    }
}