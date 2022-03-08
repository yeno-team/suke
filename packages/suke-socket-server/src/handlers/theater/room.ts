import { SocketMessage, SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { TheaterItemModel } from "@suke/suke-core/src/entities/TheaterItem";
import { TheaterItemScheduleModel } from "@suke/suke-core/src/entities/TheaterItemSchedule";
import { SocketBroadcaster } from "@suke/suke-socket-server/src/extensions/Broadcaster";
import { TheaterManager } from "@suke/suke-socket-server/src/extensions/TheaterManager";
import { getRepository } from "typeorm";
import { Broadcaster } from "typeorm/subscriber/Broadcaster";
import { SocketServer, WebSocketConnection } from "../../server";
import { Handler } from "../Handler";

export const createTheaterRoomHandler: Handler = (server: SocketServer) => (): void => {
    server.on('message', async (message: SocketMessage, ws: WebSocketConnection) => {
        const msg = message as SocketMessageInput; // For type-safe data type
        const roomManager = server.getRoomManager('theater');
        const theaterManager = new TheaterManager(server);
        const broadcaster = new SocketBroadcaster(server);
        const theaterItemRepo = getRepository(TheaterItemModel);
        const scheduleTheaterItemRepo = getRepository(TheaterItemScheduleModel);
        const sendUpdateMessage = async (roomId: string) => {
            const updatedRoom = await roomManager.getRoom(roomId);
            const roomConnectionsNoDuplicates = {};

            for (const id of updatedRoom) {
                roomConnectionsNoDuplicates[server.getConnection(id)?.remoteAddress] = id;
            }
            
            const updated = await theaterManager.editRoom(roomId, {viewerCount: Math.max(Object.keys(roomConnectionsNoDuplicates).length - 1, 0)});
            
            if (updated != null) {
                const schedule = await scheduleTheaterItemRepo.find({where: {id: roomId}, relations: ["item"]});
                if (schedule.length > 0) {
                    await theaterItemRepo.update(schedule[0].item.id, {viewerCount: updated.viewerCount});
                }
                
                broadcaster.broadcastToRoom(new SocketMessage({
                    type: 'THEATER_ROOM_UPDATE',
                    data: updated
                }), roomId, roomManager);
            } else {
                ws.send(JSON.stringify(new SocketMessage({
                    type: 'SERVER_ERROR',
                    data: "Could not update channel data."
                })));
            }
        };

        switch (msg.type) {
            case 'THEATER_ROOM_JOIN': {
                const roomId = msg.data;
                if (await roomManager.CheckIfUserInRoom(ws.id, roomId)) {
                    return;
                }

                await roomManager.addUser(roomId, ws.id);
                await sendUpdateMessage(roomId);
                ws.send(JSON.stringify(new SocketMessage({
                    type: 'THEATER_ROOM_JOIN',
                    data: msg.data
                })));
                break;
            }
            case 'THEATER_ROOM_LEAVE': {
                const roomId = msg.data;
                if (!await roomManager.CheckIfUserInRoom(ws.id, roomId)) {
                    return server.emit('clientError', new Error("Cannot leave room that you have not joined."), ws);
                }
                await sendUpdateMessage(roomId);
                await roomManager.removeUser(roomId, ws.id);
                break;
            }
        }
    });
};