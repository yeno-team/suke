import { UserId } from "@suke/suke-core/src/entities/UserId";
import { SocketServer } from "../../server";
import { SocketMessage } from '@suke/suke-core/src/entities/SocketMessage';
import { Handler } from "../Handler";

export const createTestHandler: Handler = (server: SocketServer) => (): void => {
    server.on('message', (message: SocketMessage) => {
        if (message.type == 'TEST_EVENT') {
            console.log(message.data);
            console.log(server.getConnection(new UserId(1)));
        } 
    })
}