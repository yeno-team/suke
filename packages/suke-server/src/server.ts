import express from "express";
import { IConfiguration } from "./config/Configuration";
import cors from 'cors';
import { ErrorHandler } from "./middlewares/errorHandler";
import { Container } from "typeorm-typedi-extensions";
import { UserController } from "./controllers/user";

export class Server {
    private app;

    constructor(private config: IConfiguration) {
        this.app = express();
    }

    private setupControllers() {
        const userController = Container.get(UserController);
        userController.execute(this.app);
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