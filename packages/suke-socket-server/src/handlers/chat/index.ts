import { SocketMessage, SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { SocketBroadcaster } from "@suke/suke-socket-server/src/extensions/Broadcaster";
import { SocketServer, WebSocketConnection } from "@suke/suke-socket-server/src/server";
import { Handler } from "../Handler";

export const createChatMessageHandler: Handler = (server: SocketServer) => (): void => {
    
    server.on('message', async (msg , ws: WebSocketConnection) => {
        const message = msg as SocketMessageInput;

        const broadcaster = new SocketBroadcaster(server);   
        const roomManager = server.getRoomManager();

        if (message.type === "SENT_CHAT_MESSAGE") {
            if (!(await roomManager.CheckIfUserInRoom(ws.id, message.data.channelId))) return server.emit('clientError', new Error("Cannot send message."), ws);

            msg = new SocketMessage({
                type : "RECEIVED_CHAT_MESSAGE",
                data : {
                    ...message.data,
                    emojis : []
                }
            })


            await broadcaster.broadcastToRoom(msg, message.data.channelId);
        }
    });
}