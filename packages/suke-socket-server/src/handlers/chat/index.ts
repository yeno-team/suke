import { SocketServer } from "../../server"
import { Handler } from "../Handler"


export const createChatMessageHandler: Handler = (server: SocketServer) => (): void => {
    server.on('message', (msg) => {
        server.broadcast(msg, []);
    });
}