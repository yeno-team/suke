import { RedisClientType, SocketServer } from "../server";
import { isRequestsEqual, Request } from "@suke/suke-core/src/entities/Request";

export class RequestManager {
    private redisClient: RedisClientType;

    constructor(private socketServer: SocketServer) {
        this.redisClient = socketServer.getRedisClient();
    }

    public async getRequests(channelId: string): Promise<Request[]> {
        const key = this.getRedisKey(channelId);
        const val = await this.redisClient.get(key);
        if (val == null) {
            await this.redisClient.set(key, JSON.stringify([]));
            return [];
        }

        return JSON.parse(val);
    }

    public async addRequest(channelId: string, request: Request): Promise<void> {
        const requests = await this.getRequests(channelId);

        for (const req of requests) {
            if (isRequestsEqual(req, request)) {
                throw new Error('RequestsManager: Attempt to add duplicate request.');
            }
        }
            
        await this.redisClient.set(this.getRedisKey(channelId), JSON.stringify([...requests, request]));
    }

    public async removeRequest(channelId: string, request: Request): Promise<void> {
        const data: Request[] = await this.getRequests(channelId);

        const foundIndex = data.findIndex(v => isRequestsEqual(v, request));
        if (foundIndex === -1) throw new Error("RequestManager: Can not remove non-existing request.");
        
        delete data[foundIndex];
        await this.redisClient.set(this.getRedisKey(channelId), JSON.stringify(data));
    }

    private getRedisKey(channelId: string) {
        return `channelRequests:${channelId}`;
    }
}