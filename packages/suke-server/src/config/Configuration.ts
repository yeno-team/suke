import { SessionOptions } from "express-session";

export interface IConfiguration {
    server: {
        port: number
    },
    db: {
        connectionUri: string
    },
    redis: {
        connectionUri: string
    },
    recaptcha : {
        siteKey : string,
        secretKey : string
    }
    session: SessionOptions
}