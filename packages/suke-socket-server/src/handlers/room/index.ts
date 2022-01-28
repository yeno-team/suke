import { SocketMessage, SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { SocketServer, WebSocketConnection } from "../../server";
import { Handler } from "../Handler";

export const createRoomJoinHandler: Handler = (server: SocketServer) => (): void => {
    server.on('message', async (message: SocketMessage, ws: WebSocketConnection) => {
        const msg = message as SocketMessageInput; // For type-safe data type
        const roomManager = server.getRoomManager();
        
        switch (msg.type) {
            case 'ROOM_JOIN':
                if (await roomManager.CheckIfUserInRoom(ws.id, msg.data.roomId)) {
                    return server.emit('clientError', new Error("Already joined room"), ws);
                }

                await roomManager.addUser(msg.data.roomId, ws.id);

                break;
            case 'ROOM_LEAVE':
                if (!roomManager.CheckIfUserInRoom(ws.id, msg.data.roomId)) {
                    return server.emit('clientError', new Error("Cannot leave room that you have not joined."), ws);
                }

                await roomManager.removeUser(msg.data.roomId, ws.id);
                break;
        }
    })
}