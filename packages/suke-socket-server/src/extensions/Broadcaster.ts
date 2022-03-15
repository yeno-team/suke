import { SocketMessage } from "@suke/suke-core/src/entities/SocketMessage";
import { SocketServer, WebSocketConnection } from "../server";
import { RoomManager } from "./RoomManager";

export interface BroadcasterOptions {
    blacklist?: string,
    whitelist?: string
}

export class SocketBroadcaster {
    private server: SocketServer;

    constructor(server: SocketServer) {
        this.server = server;
    }

    /**
     * Broadcast/send data to all connected users ignoring users in the ignoreList.
     * 
     * @param data Data to broadcast
     * @param BroadcasterOptions
     */
    public broadcast(data: SocketMessage, opts?: BroadcasterOptions): void {
        this.server.getConnections().forEach((v: WebSocketConnection) => {
            if (opts != null) {
                if (opts.blacklist?.indexOf(v.id) !== -1) 
                    return;

                if (opts.whitelist?.indexOf(v.id) === -1) {
                    return;
                }
            }

            v.send(JSON.stringify(data));
        });
    }

    public async broadcastToRoom(data: SocketMessage, roomId: string, roomManager: RoomManager, opts?: BroadcasterOptions): Promise<void> {
        const roomConnections = await roomManager.getRoom(roomId);

        roomConnections.forEach(async id => {
            if (opts != null) {
                if (opts.blacklist != null && opts.blacklist?.indexOf(id) !== -1) 
                    return;

                if (opts.whitelist != null && opts.whitelist?.indexOf(id) === -1) {
                    return;
                }
            }
        
            const connection = this.server.getConnection(id);
            if (connection == null) {
                await roomManager.removeUser(roomId, id);
            } else {
                connection.send(JSON.stringify(data));
            }
        });
    }
}