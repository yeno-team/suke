import { RoomManager } from "./RoomManager";
import { RealtimeChannelData } from '@suke/suke-core/src/types/UserChannelRealtime';
import { Quality } from "@suke/suke-core/src/entities/SearchResult";
import { SocketServer } from "../server";
import { SocketBroadcaster } from "./Broadcaster";
import { SocketMessage } from "@suke/suke-core/src/entities/SocketMessage";
import { RedisClient } from "redis";

/**
 * Manages realtime data inside a user channel (video source, requests)
 */
export class ChannelManager {
    /**
     * Key is the users name which is also the room name
     */
    private roomManager: RoomManager;
    private redisClient: RedisClient;

    constructor(private socketServer: SocketServer) {
        this.roomManager = socketServer.getRoomManager();
    }

    public async getChannel(channelId: string): Promise<RealtimeChannelData> {
        return new Promise((resolve, reject) => {
            const key = this.getRedisKey(channelId);
            this.redisClient.get(key, (err, val) => {
                if (err) return reject(err)
                if (val == null) return reject(`ChannelManager: Key '${key}'' does not exist.`);
                return resolve(JSON.parse(val));
            });
        })
    }
    
    public async editRealtimeChannel(channelId: string, editedData: Partial<RealtimeChannelData>): Promise<boolean> {
        const key = this.getRedisKey(channelId);
        const channel = await this.getChannel(key);
        const roomConnections = this.roomManager.getRoom(key);

        if (channel == null && roomConnections == null) {
            return false;
        } else if (channel == null) {
            this.redisClient.set(key, "");
        }
            
        const updatedData: RealtimeChannelData = {
            ...channel,
            ...editedData
        };

        this.redisClient.set(key, JSON.stringify(updatedData), (err) => {
            if (err != null) return Promise.reject(err);
        });

        /**
         * Broadcast to room that the settings updated
         */
        const broadcaster = new SocketBroadcaster(this.socketServer);
        broadcaster.broadcastToRoom(new SocketMessage(
            {
                type: "CHANNEL_UPDATE",
                data: {
                    ...updatedData,
                    channelId
                }
            }
        ), key);
    }

    private getRedisKey(key: string) {
        return `channel:${key}`
    }
}