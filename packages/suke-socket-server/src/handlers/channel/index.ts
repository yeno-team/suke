import { SocketMessage, SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { User } from "@suke/suke-core/src/entities/User";
import { UserId } from "@suke/suke-core/src/entities/UserId";
import { ChannelManager } from "../../extensions/ChannelManager";
import { SocketServer, WebSocketConnection } from "../../server";
import { Handler } from "../Handler";
import { getRepository } from "typeorm";
import { UserChannelModel } from "@suke/suke-core/src/entities/UserChannel/UserChannel";
import { SocketBroadcaster } from "../../extensions/Broadcaster";
import { RequestManager } from "../../extensions/RequestManager";


export const createChannelHandler: Handler = (server: SocketServer) => (): void => {
    server.on('message', async (message: SocketMessage, ws: WebSocketConnection, user?: User) => {
        const msg = message as SocketMessageInput; // For type-safe data type
        const channelManager = new ChannelManager(server);

        const broadcaster = new SocketBroadcaster(server);
        const channelRepo = getRepository(UserChannelModel);
        const requestManager = new RequestManager(server);
        const users = server.getUserConnections();

        if (user.Id().Equals(new UserId(0))) {
            return server.emit('clientError', new Error("You do not have permission to use this event."), ws)
        }

        switch(msg.type) {
            case 'CHANNEL_REQUEST_ADD':
                try {
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
                    const requests = await requestManager.getRequests(msg.data)
                    ws.send(JSON.stringify(new SocketMessage({
                        type: 'CHANNEL_REQUESTS',
                        data: requests
                    })));
                } catch (e) {
                    server.emit('error', e);
                }
                break;
            case 'CHANNEL_UPDATE':
                try {
                    const updated = await channelManager.editRealtimeChannel(msg.data.channelId, msg.data);
                
                    if (updated) {
                        broadcaster.broadcastToRoom(new SocketMessage({
                            type: 'CHANNEL_UPDATE',
                            data: msg.data
                        }), msg.data.channelId)
                    } else {
                        ws.send(new SocketMessage({
                            type: 'SERVER_ERROR',
                            data: "Could not update channel data."
                        }));
                    }
                } catch (e) {
                    server.emit('clientError', e, ws)
                }
                break;
        }
    }) 
}