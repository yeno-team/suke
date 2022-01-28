import { SocketServer } from "../../server";
import { SocketMessage } from '@suke/suke-core/src/entities/SocketMessage';
import { Handler } from "../Handler";
import { Name } from "@suke/suke-core/src/entities/Name/Name";

export const createTestHandler: Handler = (server: SocketServer) => (): void => {
    server.on('message', (message: SocketMessage) => {
        if (message.type == 'TEST_EVENT') {
            console.log(message.data);
            console.log(server.getUserConnection(new Name("sup")));
        } 
    });
};