import { Service } from "typedi";
import { BaseController } from "./BaseController";
import cors_proxy from 'cors-anywhere';
import expressHttpProxy from 'express-http-proxy';
import config from '../config';
import { Express } from 'express';
@Service()
export class ProxyController extends BaseController {
    public route = "/api/proxy/";

    constructor() {
        super();
    }

    public execute(app: Express): void {
        app.use(this.route, expressHttpProxy(`${config.server.host}:${config.corsProxy.port}`));
    }
}