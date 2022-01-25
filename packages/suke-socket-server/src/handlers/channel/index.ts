import { SocketMessage, SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { User } from "@suke/suke-core/src/entities/User";
import { UserId } from "@suke/suke-core/src/entities/UserId";
import { ChannelManager } from "../../extensions/ChannelManager";
import { SocketServer, WebSocketConnection } from "../../server";
import { Handler } from "../Handler";
import { SocketBroadcaster } from "../../extensions/Broadcaster";
import { RequestManager } from "../../extensions/RequestManager";
import { Name } from "@suke/suke-core/src/entities/Name/Name";

export const createChannelHandler: Handler = (server: SocketServer) => (): void => {
    server.on('message', async (message: SocketMessage, ws: WebSocketConnection, user?: User) => {
        const msg = message as SocketMessageInput; // For type-safe data type
        const channelManager = new ChannelManager(server);

        const broadcaster = new SocketBroadcaster(server);
        const requestManager = new RequestManager(server);
        const roomManager = server.getRoomManager();

        switch(msg.type) {
            case 'CHANNEL_REQUEST_ADD':
                try {
                    if (user == null || user.Id().Equals(new UserId(0))) {
                        return server.emit('clientError', new Error("You need an account to access requests feature."), ws)
                    }

                    if (await roomManager.CheckIfUserInRoom(ws.id, msg.data.roomId)) {
                        return server.emit('clientError', new Error("You have not joined the channel's room."), ws);
                    }

                    await requestManager.addRequest(msg.data.roomId, msg.data);

                    broadcaster.broadcastToRoom(new SocketMessage({
                        type: "CHANNEL_REQUEST_ADD",
                        data: msg.data
                    }), msg.data.roomId);
                } catch (e) {
                    server.emit('error', e);
                }
                break;
            case 'CHANNEL_REQUEST_REMOVE':
                try {
                    if (user == null || user.Id().Equals(new UserId(0))) {
                        return server.emit('clientError', new Error("You need an account to access requests feature."), ws)
                    }

                    if (await roomManager.CheckIfUserInRoom(ws.id, msg.data.roomId)) {
                        return server.emit('clientError', new Error("You have not joined the channel's room."), ws);
                    }

                    if (msg.data?.requestedBy.find(v => !(new UserId(v.userId).Equals(user.Id())) && msg.data.roomId.toLowerCase() != user.name.toLowerCase())) {
                        server.emit('clientError', new Error("You do not have permission to remove this request."), ws)
                    }

                    await requestManager.removeRequest(msg.data.roomId, msg.data);

                    broadcaster.broadcastToRoom(new SocketMessage({
                        type: "CHANNEL_REQUEST_REMOVE",
                        data: msg.data
                    }), msg.data.roomId);
                } catch (e) {
                    server.emit('error', e);
                }
                break;
            case 'CHANNEL_REQUESTS_GET':
                try {
                    if (await roomManager.CheckIfUserInRoom(ws.id, msg.data)) {
                        return;
                    }
                    const channel = await channelManager.getChannel(msg.data)
                    const requests = await requestManager.getRequests(msg.data)
                    ws.send(JSON.stringify(new SocketMessage({
                        type: 'CHANNEL_REQUESTS',
                        data: requests
                    })));
                    ws.send(JSON.stringify(new SocketMessage({
                        type: 'CHANNEL_UPDATE',
                        data: {
                            ...channel,
                            password: "*".repeat(channel.password.length)
                        }
                    })));
                } catch (e) {
                    server.emit('error', e);
                }
                break;
            case 'CHANNEL_UPDATE':
                try {
                    if (!user.Name().Equals(new Name(msg.data.channelId.toLowerCase()))) {
                        return server.emit('clientError', new Error("You do not have permission to edit channel data."), ws);
                    }   

                    if (msg.data.title != null && msg.data.title.length > 35) {
                        return server.emit('clientError', new Error("Title should be smaller than 35 characters."), ws); 
                    }

                    const updated = await channelManager.editRealtimeChannel(msg.data.channelId, msg.data);
                    
                    if (updated != null) {
                        broadcaster.broadcastToRoom(new SocketMessage({
                            type: 'CHANNEL_UPDATE',
                            data: {
                                ...updated,
                                password: "*".repeat(updated.password.length)
                            }
                        }), msg.data.channelId)
                    } else {
                        ws.send(JSON.stringify(new SocketMessage({
                            type: 'SERVER_ERROR',
                            data: "Could not update channel data."
                        })));
                    }
                } catch (e) {
                    server.emit('clientError', e, ws)
                }
                break;
            case 'CHANNEL_GET':
                try {
                    const channel = await channelManager.getChannel(msg.data);
                    if (channel != null) {
                        ws.send(JSON.stringify(new SocketMessage({
                            type: 'CHANNEL_UPDATE',
                            data: {
                                ...channel,
                                password: "*".repeat(channel.password.length)
                            }
                        })));
                    }
                } catch (e) {
                    server.emit('clientError', e, ws)
                }
        }
    }) 
}