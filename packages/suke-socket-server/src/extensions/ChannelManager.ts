import { RoomManager } from "./RoomManager";
import { RealtimeChannelData } from '@suke/suke-core/src/types/UserChannelRealtime';
import { Quality } from "@suke/suke-core/src/entities/SearchResult";
import { SocketServer } from "../server";
import { SocketBroadcaster } from "./Broadcaster";
import { SocketMessage } from "@suke/suke-core/src/entities/SocketMessage";

/**
 * Manages realtime data inside a user channel (video source, requests)
 */
export class ChannelManager {
    /**
     * Key is the users name which is also the room name
     */
    private channels: Map<string, RealtimeChannelData>
    private roomManager: RoomManager;

    constructor(private socketServer: SocketServer) {
        this.channels = new Map();
        this.roomManager = socketServer.getRoomManager();
    }

    public getChannel(key: string): RealtimeChannelData {
        return this.channels.get(key);
    }
    
    public editChannel(key: string, editedData: Partial<RealtimeChannelData>): boolean {
        const channel = this.getChannel(key);
        const roomConnections = this.roomManager.getRoom(key);

        if (channel == null && roomConnections == null) {
            return false;
        } else if (channel == null) {
            this.channels.set(key, {} as RealtimeChannelData);
        }
            
        const updatedData = {
            ...channel,
            ...editedData
        };

        this.channels.set(key, updatedData);

        /**
         * Broadcast to room that the settings updated
         */
        const broadcaster = new SocketBroadcaster(this.socketServer);

        broadcaster.broadcastToRoom(new SocketMessage(
            {
                type: "ROOM_UPDATE",
                data: updatedData
            }
        ), key);
    }
}