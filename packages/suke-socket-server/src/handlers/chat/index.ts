import { SocketMessage, SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { SocketBroadcaster } from "@suke/suke-socket-server/src/extensions/Broadcaster";
import { SocketServer, WebSocketConnection } from "@suke/suke-socket-server/src/server";
import { GlobalEmojiService as _GlobalEmojiService } from "@suke/suke-server/src/services/globalemoji";
import { parseEmojis } from "@suke/suke-util/src/parseEmojis";
import { Handler } from "../Handler";
import { Container } from "typedi";

export const createChatMessageHandler: Handler = (server: SocketServer) => (): void => {
    const GlobalEmojiService = Container.get(_GlobalEmojiService)
    
    server.on('message', async (msg , ws: WebSocketConnection) => {
        const message = msg as SocketMessageInput;

        const broadcaster = new SocketBroadcaster(server);   
        const roomManager = server.getRoomManager();

        if (message.type === "SENT_CHAT_MESSAGE") {
            if (!(await roomManager.CheckIfUserInRoom(ws.id, message.data.channelId))) return server.emit('clientError', new Error("Cannot send message."), ws);


            const parsedEmojis = parseEmojis(message.data.content)

            // Fetch details of the emojis in the message.
            // Filter out the results by getting rid of the emojis that couldn't be found.
            console.time("weqe")
            const emojis = (await Promise.all(parsedEmojis.map(async({ id }) => await GlobalEmojiService.findById(id)))).filter((emoji) => emoji)

            msg = new SocketMessage({
                type : "RECEIVED_CHAT_MESSAGE",
                data : {
                    ...message.data,
                    emojis
                }
            })


            await broadcaster.broadcastToRoom(msg, message.data.channelId);

            console.timeEnd("weqe")
        }
    });
}