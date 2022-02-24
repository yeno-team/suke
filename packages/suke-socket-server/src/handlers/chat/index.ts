import { SocketMessage, SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { SocketBroadcaster } from "@suke/suke-socket-server/src/extensions/Broadcaster";
import { ChannelManager } from "@suke/suke-socket-server/src/extensions/ChannelManager";
import { SocketServer, WebSocketConnection } from "@suke/suke-socket-server/src/server";
import { Handler } from "../Handler";
import { getRepository } from "typeorm";
import { UserModel } from "@suke/suke-core/src/entities/User";

const createChatMessageHandler: Handler = (server: SocketServer, roomManagerKey: string) => (): void => {
    server.on('message', async (msg, ws: WebSocketConnection, user) => {
        const message = msg as SocketMessageInput;

        const broadcaster = new SocketBroadcaster(server);   
        const roomManager = server.getRoomManager(roomManagerKey);
        const channelManager = new ChannelManager(server);
        const userRepository = getRepository(UserModel);

        if (message.type === "SENT_CHAT_MESSAGE") {
            if (message.data.content.trim() === "") return;
            if (message.data.channel.toLowerCase() != roomManagerKey.toLowerCase()) return;
            if (!(await roomManager.CheckIfUserInRoom(ws.id, message.data.channelId))) return;
            if (server.getGuestConnection(ws.id) != null) return server.emit('clientError', new Error("Sign up to chat!"), ws);
            
            const channel = await channelManager.getChannel(message.data.channelId);

            if (channel != null && channel.followerOnlyChat) {
                const owner = await userRepository.findOne({where: {name: message.data.channelId}, relations: ['channel', 'channel.followers', 'channel.followers.follower']});

                if (owner != null && owner.id != user.id && owner.channel.followers.find(v => v.follower.id === user.id) == null) {
                    return server.emit('clientError', new Error("The chat is on follower only mode! Follow if you want to chat!"), ws);
                }
            }
            console.log("SUP");
            msg = new SocketMessage({
                type : "RECEIVED_CHAT_MESSAGE",
                data : {
                    ...message.data,
                }
            });

            await broadcaster.broadcastToRoom(msg, message.data.channelId, roomManager);
        }
    });
};

export const createChatMessageHandlers: Handler = (server: SocketServer) => (): void => {
    createChatMessageHandler(server, 'channel')();
    createChatMessageHandler(server, 'theater')();
};