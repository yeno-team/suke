import { RoomManager } from "./RoomManager";
import { RealtimeChannelData } from '@suke/suke-core/src/types/UserChannelRealtime';
import { Quality } from "@suke/suke-core/src/entities/SearchResult";
import { RedisClientType, SocketServer } from "../server";


/**
 * Manages realtime data inside a user channel (video source, requests)
 */
export class ChannelManager {
    /**
     * Key is the users name which is also the room name
     */
    private roomManager: RoomManager;
    private redisClient: RedisClientType;

    constructor(private socketServer: SocketServer) {
        this.redisClient = socketServer.getRedisClient();
        this.roomManager = socketServer.getRoomManager();
    }

    public async getChannel(channelId: string): Promise<RealtimeChannelData> {
        const key = this.getRedisKey(channelId);

        const val = await this.redisClient.get(key);
        if (val == null) {
            const defaultValue: RealtimeChannelData = {
                currentVideo: {
                    sources: [{
                        url: new URL("https://www.youtube.com/watch?v=NpEaa2P7qZI"), 
                        quality: Quality.auto
                    }], 
                    name: 'Looking for a Video.',
                    category: 'Browsing'
                },
                progress: {currentTime: 0}, 
                paused: false
            };
            await this.redisClient.set(key, JSON.stringify(defaultValue));
            return defaultValue;
        } 
        return JSON.parse(val);
    }
    
    public async editRealtimeChannel(channelId: string, editedData: Partial<RealtimeChannelData>): Promise<RealtimeChannelData> {
        const key = this.getRedisKey(channelId);
        const channel = await this.getChannel(channelId);
        
        const roomConnections = this.roomManager.getRoom(key);

        if (channel == null && roomConnections == null) {
            throw new Error("Channel probably doesn't exist.");
        }

        const updatedData: RealtimeChannelData = {
            ...channel,
            ...editedData
        };

        await this.redisClient.set(key, JSON.stringify(updatedData));
        
        return updatedData;
    }

    private getRedisKey(key: string) {
        return `channel:${key}`
    }
}