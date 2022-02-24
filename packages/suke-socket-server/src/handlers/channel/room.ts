import { Name } from "@suke/suke-core/src/entities/Name/Name";
import { SocketMessage, SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { SocketBroadcaster } from "../../extensions/Broadcaster";
import { ChannelManager } from "../../extensions/ChannelManager";
import { SocketServer, WebSocketConnection } from "../../server";
import { Handler } from "../Handler";

export const createChannelRoomHandler: Handler = (server: SocketServer) => (): void => {
    server.on('message', async (message: SocketMessage, ws: WebSocketConnection, user) => {
        const msg = message as SocketMessageInput; // For type-safe data type
        const roomManager = server.getRoomManager('channel');
        const channelManager = new ChannelManager(server);
        const broadcaster = new SocketBroadcaster(server);
        const categoryManager = server.getCategoryManager();

        const setupListeners = {};

        const sendUpdateMessage = async (roomId: string) => {
            const updatedRoom = await roomManager.getRoom(roomId);
            const roomConnectionsNoDuplicates = {};

            for (const id of updatedRoom) {
                roomConnectionsNoDuplicates[server.getConnection(id)?.remoteAddress] = id;
            }
            
            const updated = await channelManager.editRealtimeChannel(roomId, {viewerCount: Math.max(Object.keys(roomConnectionsNoDuplicates).length - 1, 0)});
            
            if (updated != null) {
                categoryManager.updateRoomViewerCount(roomId, updated.category, updated.viewerCount);
                broadcaster.broadcastToRoom(new SocketMessage({
                    type: 'CHANNEL_UPDATE',
                    data: updated
                }), roomId, roomManager);
            } else {
                ws.send(JSON.stringify(new SocketMessage({
                    type: 'SERVER_ERROR',
                    data: "Could not update channel data."
                })));
            }

            if (setupListeners[ws.id] == null) {
                setupListeners[ws.id] = 1;

                ws.on('close', () => {
                    server.emit('message', new SocketMessage({type: 'CHANNEL_ROOM_LEAVE', data: {roomId}}), ws);
                    setupListeners[ws.id] = null;
                });
            }
        };

        switch (msg.type) {
            case 'CHANNEL_ROOM_JOIN': {
                if (await roomManager.CheckIfUserInRoom(ws.id, msg.data.roomId)) {
                    return;
                }
                const ownerName = new Name(msg.data.roomId.toLowerCase());
                const channel = await channelManager.getChannel(msg.data.roomId);
                if (!user.Name().Equals(ownerName) && channel != null && channel.private) {
                    if (channel.password !== (msg.data.password || "")) {
                        return server.emit('clientError', new Error("Incorrect Password."), ws);
                    }
                }

                await roomManager.addUser(msg.data.roomId, ws.id);

                // if user is owner set channel to live
                if(user.Name().Equals(ownerName)) {
                    await channelManager.editRealtimeChannel(msg.data.roomId, {live: true});
                }

                await sendUpdateMessage(msg.data.roomId);
                ws.send(JSON.stringify(new SocketMessage({
                    type: 'CHANNEL_ROOM_JOIN',
                    data: msg.data
                })));
                break;
            }
            case 'CHANNEL_ROOM_LEAVE': {
                if (!await roomManager.CheckIfUserInRoom(ws.id, msg.data.roomId)) {
                    return server.emit('clientError', new Error("Cannot leave room that you have not joined."), ws);
                }

                const ownerName = new Name(msg.data.roomId.toLowerCase());
                await roomManager.removeUser(msg.data.roomId, ws.id);

                 // set channel to not be live if owner leaves the room.
                 if (server.getUserConnection(ownerName) == null) {
                    await channelManager.editRealtimeChannel(msg.data.roomId, {live:false});
                }

                await sendUpdateMessage(msg.data.roomId);
                break;
            }
        }
    });
};