import { SocketMessage } from "@suke/suke-core/src/entities/SocketMessage";
import { SocketServer, WebSocketConnection } from "../server";


export class SocketBroadcaster {
    private server: SocketServer;

    constructor(server: SocketServer) {
        this.server = server;
    }

    /**
     * Broadcast/send data to all connected users ignoring users in the ignoreList.
     * 
     * @param data Data to broadcast
     * @param ignoreList socket ids to ignore
     */
    public broadcast(data: SocketMessage, ignoreList: string[] = []): void {
        this.server.getConnections().forEach((v: WebSocketConnection) => {
            if (ignoreList.indexOf(v.id) !== -1) 
                return;

            v.send(JSON.stringify(data));
        });
    }

    public broadcastToRoom(data: SocketMessage, roomId: string, ignoreList: string[] = []): void {
        const roomManager = this.server.getRoomManager();

        roomManager.getRoom(roomId).forEach(v => {
            if (ignoreList.indexOf(v.id) !== -1) 
                return;

            v.send(JSON.stringify(data));
        });
    }


}