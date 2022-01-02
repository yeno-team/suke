import { SocketMessage, SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { SocketBroadcaster } from "@suke/suke-socket-server/src/extensions/Broadcaster";
import { SocketServer, WebSocketConnection } from "@suke/suke-socket-server/src/server";
import { GlobalEmojiService as _GlobalEmojiService } from "@suke/suke-server/src/services/globalemoji";
import { parseEmojis } from "@suke/suke-util/src/parseEmojis";
import { Handler } from "../Handler";
import { Container } from "typedi";
import { MessageEmoji } from "@suke/suke-core/src/types/Emoji";

export const createChatMessageHandler: Handler = (server: SocketServer) => (): void => {
    const GlobalEmojiService = Container.get(_GlobalEmojiService)
    
    server.on('message', async (msg , ws: WebSocketConnection) => {
        const message = msg as SocketMessageInput;

        const broadcaster = new SocketBroadcaster(server);   
        const roomManager = server.getRoomManager();

        if (message.type === "SENT_CHAT_MESSAGE") {
            if (!(await roomManager.CheckIfUserInRoom(ws.id, message.data.channelId))) return server.emit('clientError', new Error("Cannot send message."), ws);

            const emojis : Array<MessageEmoji> = []
            const parsedEmojis = parseEmojis(message.data.content)

            // Validate each emoji in the message.
            for(let i = 0; i < parsedEmojis.length; i++) {
                const emoji = await GlobalEmojiService.findById(parsedEmojis[i].id)

                if(emoji)  {
                    emojis.push({
                        ...parsedEmojis[i],
                        ...emoji
                    })
                }
            }
            
            msg = new SocketMessage({
                type : "RECEIVED_CHAT_MESSAGE",
                data : {
                    ...message.data,
                    emojis
                }
            })

            await broadcaster.broadcastToRoom(msg, message.data.channelId);
        }
    });
}