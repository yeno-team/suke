import { SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { SocketBroadcaster } from "../../extensions/Broadcaster";
import { SocketServer, WebSocketConnection } from "../../server"
import { Handler } from "../Handler"


export const createChatMessageHandler: Handler = (server: SocketServer) => (): void => {
    server.on('message', (msg, ws: WebSocketConnection) => {

        const message = msg as SocketMessageInput;

        const broadcaster = new SocketBroadcaster(server);   
        const roomManager = server.getRoomManager();

        if (message.type == 'CHAT_MESSAGE') {
            if (!roomManager.CheckIfUserInRoom(ws, message.data.channelId))
                return server.emit('clientError', new Error("Cannot send message."), ws);
        
            broadcaster.broadcastToRoom(msg, message.data.channelId);
        }
    });
}