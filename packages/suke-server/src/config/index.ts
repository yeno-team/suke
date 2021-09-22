import dotenv from 'dotenv';
import path from 'path';
import { IConfiguration } from './Configuration';
import { getEnvironmentVariable } from '@suke/suke-util'

dotenv.config({
    path: path.resolve(__dirname, "../../server.conf")
});

const config: IConfiguration = {
    server: {
        port: parseInt(getEnvironmentVariable("PORT", false, "3000") as string)
    },
    db: {
        connectionUri: getEnvironmentVariable("DB_CONNECTION_URI", true) as string
    }
}

export default config;