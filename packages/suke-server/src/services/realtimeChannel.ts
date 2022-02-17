import { RealtimeRoomData } from "@suke/suke-core/src/types/UserChannelRealtime";
import { RedisClientType } from "@suke/suke-server/src/config";
import { Inject, Service } from "typedi";


@Service()
export class RealtimeChannelService {
    constructor(@Inject("redis") private redisClient : RedisClientType) {}

    public async getChannels(cursor = 0, limit = 20): Promise<{data: RealtimeRoomData[], nextCursor: number}> {
        const keyPattern = "channel:*";
        const channelScan = await this.redisClient.scan(cursor, { MATCH: keyPattern, COUNT: limit});
        
        const data: RealtimeRoomData[] = [];

        for (const key of channelScan.keys) {
            const channel = await this.redisClient.get(key);
            
            if (channel != null ) {
                const parsedChannel: RealtimeRoomData = JSON.parse(channel);
                if (!parsedChannel.private) {
                    data.push({
                        ...parsedChannel,
                        password: "*".repeat(parsedChannel.password.length)
                    });
                }
            }
        }

        return {
            data,
            nextCursor: channelScan.cursor
        };  
    }

    public async getSortedChannels(pageNumber = 1, limit = 20, order: "ASC" | "DESC" = "DESC"): Promise<RealtimeRoomData[]> {
        if (pageNumber <= 0) throw new Error("Page Number should be greater than 0");
        
        const startIndex = (pageNumber-1) * limit;
        const endIndex = pageNumber * limit;

        const sortedChannels = await this.redisClient.ZRANGE("channel_viewers", startIndex, endIndex, order === "DESC" ? {REV: true} : {});

        const data: RealtimeRoomData[] = [];

        for (const key of sortedChannels) {
            const channel = await this.redisClient.get(key);
            
            if (channel != null) {
                const parsedChannel: RealtimeRoomData = JSON.parse(channel);
                data.push({
                    ...parsedChannel,
                    password: "*".repeat(parsedChannel.password.length)
                });
            }
        }

        return data;
    }
}