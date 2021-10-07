import { SessionOptions } from "express-session";

export interface IConfiguration {
    server: {
        port: number
    },
    db: {
        connectionUri: string
    },
    session: SessionOptions
}