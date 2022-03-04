import { SocketMessage, SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { SocketServer, WebSocketConnection } from "../../server";
import { Handler } from "../Handler";

export const createTheaterRoomHandler: Handler = (server: SocketServer) => (): void => {
    server.on('message', async (message: SocketMessage, ws: WebSocketConnection) => {
        const msg = message as SocketMessageInput; // For type-safe data type
        const roomManager = server.getRoomManager('theater');
    
        switch (msg.type) {
            case 'THEATER_ROOM_JOIN': {
                const roomId = msg.data;
                if (await roomManager.CheckIfUserInRoom(ws.id, roomId)) {
                    return;
                }

                await roomManager.addUser(roomId, ws.id);

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

                await roomManager.removeUser(roomId, ws.id);
                break;
            }
        }
    });
};