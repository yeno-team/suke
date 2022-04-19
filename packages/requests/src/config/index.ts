import { getEnvironmentVariable } from '@suke/suke-util';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({
    path: path.resolve(__dirname, "../../requests.conf")
});
const config = {
    proxy: {
        host: getEnvironmentVariable("PROXY_HOST", false, ""),
        port: getEnvironmentVariable("PROXY_PORT", false, ""),
        auth: {
            username: getEnvironmentVariable("PROXY_AUTH_USER", false, ""),
            password: getEnvironmentVariable("PROXY_AUTH_PASS", false, "")
        }
    }
}

export default config