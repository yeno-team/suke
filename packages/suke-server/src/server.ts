import express, { Request, RequestHandler } from "express";
import { IConfiguration } from "./config/Configuration";
import cors from 'cors';
import { ErrorHandler } from "./middlewares/errorHandler";
import { Container } from "typeorm-typedi-extensions";
import controllers from './controllers';
import { SocketServer } from "@suke/suke-socket-server/src/server";
import session from 'express-session';
import http from 'http';
import { IUser, UserModel } from "@suke/suke-core/src/entities/User";
import config, { RedisClient } from "./config";
import { setGlobalRateLimiter } from "./middlewares/setGlobalRateLimiter";
import { RateLimiterOpts } from "@suke/suke-core/src/entities/RateLimiterOpts";
import handlers from "@suke/suke-socket-server/src/handlers";
import { TypeormStore } from 'connect-typeorm';
import { getRepository } from "typeorm";
import { SessionModel } from '@suke/suke-core/src/entities/Session';
import { createProxyMiddleware } from 'http-proxy-middleware';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';

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
        this.app.use(express.static(__dirname + "/static", {dotfiles: 'allow'}));
        if (config.node_env == 'production') {
            this.app.use(compression());
            this.app.use(helmet({
                contentSecurityPolicy: false
            }));
        } else {
            this.app.use(cors({origin: "*"}));
        }
        
        this.app.use('/api/proxy/referer/:referer/:url(*)', createProxyMiddleware({
            router: this.proxyRouterFunction,
            pathRewrite: (p, req) => new URL(decodeURIComponent(req.params.url)).pathname,
            onProxyReq: (proxyReq, req) => {
                proxyReq.setHeader('Referer', decodeURIComponent(req.params.referer));
            },
            changeOrigin: true
        }));
        this.app.use('/api/proxy/:url(*)', createProxyMiddleware({
            router: this.proxyRouterFunction,
            pathRewrite: () => '',
            changeOrigin: true
        }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(this.sessionParser);
        this.app.use(setGlobalRateLimiter());

        this.setupControllers();
        if (process.env.NODE_ENV == 'production') {
            console.log("---===[[ Serving production build of suke-web ]]===---");
            this.app.use(express.static(path.join(__dirname, '../../../packages/suke-web/build')));
            this.app.get('*', (req, res) => {
                res.sendFile(path.join(__dirname, '../../../packages/suke-web/build', 'index.html'));
            });
        }
   
        // create socket handlers
        for (const createHandler of handlers) {
            createHandler(this.socketServer)();
        }

        this.app.use(ErrorHandler);
        // Listening from the socket server will listen on the httpServer that is shared from express.
        this.socketServer.start(this.config.server.port, "0.0.0.0", () => {
            console.log("Suke Server Listening on " + this.config.server.port);
        });
    }

    private proxyRouterFunction(req: Request) {
        const mainUrl = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
        const proxyUrl = new URL(decodeURIComponent(req.params.url));
        return proxyUrl.toString() + mainUrl.search;
    }
}