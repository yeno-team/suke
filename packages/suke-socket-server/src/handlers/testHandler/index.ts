import { UserId } from "@suke/suke-core/src/entities/UserId";
import { SocketServer, SocketServerMessage } from "../../server";
import { Handler } from "../Handler";

export const createTestHandler: Handler = (server: SocketServer) => (): void => {
    server.on('message', (message: SocketServerMessage) => {
        if (message.type == 'TEST_EVENT') {
            console.log(message.data);
            console.log(server.getUserConnection(new UserId(1)));
        } 
    })
}