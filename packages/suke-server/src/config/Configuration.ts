import { SessionOptions } from "express-session";

export interface IConfiguration {
    "node_env" : "development" | "production",
    "production_url" : string
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
    email : {
        host : string,
        port : number,
        username : string,
        password : string,
        jwtSecret : string
    },
    corsProxy: {
        port: number
    }
}