import { SocketServer, WebSocketConnection } from "../../server";
import { SocketMessage, SocketMessageInput } from '@suke/suke-core/src/entities/SocketMessage';
import { Handler } from "../Handler";
import { TheaterManager } from "@suke/suke-socket-server/src/extensions/TheaterManager";
import { RealtimeTheaterRoomData } from "@suke/suke-core/src/types/UserChannelRealtime";
import Container from "typedi";
import { RedisClientType } from "@suke/suke-server/src/config";

export const createTheaterHandler: Handler = (server: SocketServer) => (): void => {
    server.on('message', async (message: SocketMessage, ws: WebSocketConnection) => {
        const msg = message as SocketMessageInput; // For type-safe data type
        const theaterManager = new TheaterManager(server);
        const roomManager = server.getRoomManager('theater');
        const pubRedisClient = Container.get<RedisClientType>('pubredis');

        const handleSchedulerEvents = async (data: string) => {
            try {
                const roomData: RealtimeTheaterRoomData = JSON.parse(data);

                await roomManager.broadcastToRoom(new SocketMessage({
                    type: 'THEATER_ROOM_UPDATE',
                    data: roomData
                }), roomData.id);
            } catch (e) { 
                server.emit('error', e);
            }
        };

        pubRedisClient.subscribe('theater-live', handleSchedulerEvents);
        pubRedisClient.subscribe('theater-end', handleSchedulerEvents);

        switch (msg.type) {
            case "THEATER_ROOM_GET":
                try {
                    if (await roomManager.CheckIfUserInRoom(ws.id, msg.data)) {
                        return;
                    }
                    const theaterData = await theaterManager.getRoom(msg.data);
                    ws.send(JSON.stringify(new SocketMessage({
                        type: 'THEATER_ROOM_UPDATE',
                        data: {
                            ...theaterData
                        }
                    })));
                } catch (e) {
                    server.emit('error', e);
                }
        }  
    });
};