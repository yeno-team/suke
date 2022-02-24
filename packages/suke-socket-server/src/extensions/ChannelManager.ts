import { RoomManager } from "./RoomManager";
import { RealtimeRoomData } from '@suke/suke-core/src/types/UserChannelRealtime';
import { Quality } from "@suke/suke-core/src/entities/SearchResult";
import { RedisClientType, SocketServer } from "../server";
import { Repository, getRepository } from "typeorm";
import { UserModel } from "@suke/suke-core/src/entities/User";

/**
 * Manages realtime data inside a user channel (video source, requests)
 */
export class ChannelManager {
    /**
     * Key is the users name which is also the room name
     */
    private roomManager: RoomManager;
    private redisClient: RedisClientType;
    private server: SocketServer;
    private userRepository: Repository<UserModel>;

    constructor(private socketServer: SocketServer) {
        this.server = socketServer;
        this.redisClient = socketServer.getRedisClient();
        this.roomManager = socketServer.getRoomManager('channel');
        this.userRepository = getRepository(UserModel);
    }

    public async getChannel(channelId: string, createIfNotExist = true): Promise<RealtimeRoomData> {
        const key = this.getRedisKey(channelId);

        const foundUser = await this.userRepository.findOne({where: {name: channelId.toLowerCase()}});
        if (foundUser == null) {
            return;
        }

        const val = await this.redisClient.get(key);

        if (!createIfNotExist && val == null)
            return;

        if (val == null && createIfNotExist) {
            const defaultValue: RealtimeRoomData = {
                id: channelId,
                title: "Looking for something to watch",
                category: "browsing",
                viewerCount: 0,
                thumbnail: {
                    url: 'https://i.ytimg.com/vi/NpEaa2P7qZI/maxresdefault.jpg'
                },
                currentVideo: {
                    sources: [{
                        url: new URL("https://www.youtube.com/watch?v=NpEaa2P7qZI"), 
                        quality: Quality.auto
                    }], 
                    name: 'Looking for a Video.',
                    thumbnail_url: 'https://i.ytimg.com/vi/NpEaa2P7qZI/maxresdefault.jpg'
                },
                progress: {currentTime: 0}, 
                paused: false,
                private: false,
                password: "",
                followerOnlyChat: false,
                live: false
            };
            await this.redisClient.set(key, JSON.stringify(defaultValue));
            await this.redisClient.ZADD("channel_viewers", [{score: 0, value: key}]);
            return defaultValue;
        } 
        return JSON.parse(val);
    }
    
    public async editRealtimeChannel(channelId: string, editedData: Partial<RealtimeRoomData>): Promise<RealtimeRoomData> {
        const key = this.getRedisKey(channelId);
        const channel = await this.getChannel(channelId);
        
        const roomConnections = this.roomManager.getRoom(key);

        if (channel == null || roomConnections == null) {
            return;
        }

        if (editedData.category != null && editedData.category != channel.category) {
            const categoryManager = this.server.getCategoryManager();
            categoryManager.updateRoomViewerCount(channelId, editedData.category, channel.viewerCount);
        }

        // update channel_viewers sorted set used for sorting the channels by viewer count
        if (channel.private === false && editedData.viewerCount != null && editedData.viewerCount != channel.viewerCount) {
            await this.redisClient.ZREM("channel_viewers", key);
            await this.redisClient.ZADD("channel_viewers", [{value: key, score: editedData.viewerCount}]);
        }

        if ((channel.private === true && editedData.private !== false) || editedData.private === true) {
            await this.redisClient.ZREM("channel_viewers", key);
        }

        if (editedData.private === false) {
            await this.redisClient.ZREM("channel_viewers", key);
            await this.redisClient.ZADD("channel_viewers", [{value: key, score: editedData.viewerCount}]);
        }

        const updatedData: RealtimeRoomData = {
            ...channel,
            ...editedData
        };

        await this.redisClient.set(key, JSON.stringify(updatedData));
        
        return updatedData;
    }

    public async removeChannel(channelId: string): Promise<void> {
        const key = this.getRedisKey(channelId);

        await this.redisClient.DEL(key);
    }

    private getRedisKey(key: string) {
        return `channel:${key.toLowerCase()}`;
    }
}