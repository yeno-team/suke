import { SessionOptions } from "express-session";

export interface IConfiguration {
    server: {
        host: string,
        port: number
    },
    db: {
        connectionUri: string
    },
    redis: {
        connectionUri: string
    },
    recaptcha : {
        secretKey : string
    },
    session: SessionOptions,
    corsProxy: {
        port: number
    }
}