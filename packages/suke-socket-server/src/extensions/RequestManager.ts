import { SocketServer } from "../server";
import { getRequestedId, isRequestsEqual, Request } from "@suke/suke-core/src/entities/Request";
import { RedisClient } from "redis";
import { isValidJson } from "@suke/suke-util";

export class RequestManager {
    private redisClient: RedisClient;

    constructor(private socketServer: SocketServer) {
        this.redisClient = socketServer.getRedisClient();
    }

    public async getRequests(channelId: string): Promise<Request[]> {
        return new Promise((resolve, reject) => {
            const key = this.getRedisKey(channelId);
            this.redisClient.get(key, (err, val) => {
                if (err) return reject(err);
                if (val == null) return resolve([]);
                return resolve(JSON.parse(val));
            });
        });
    }

    public async addRequest(channelId: string, request: Request): Promise<void> {
        const requests = await this.getRequests(channelId);

        for (const req of requests) {
            if (isRequestsEqual(req, request)) {
                throw new Error('RequestsManager: Attempt to add duplicate request.');
            }
        }
            
        this.redisClient.set(this.getRedisKey(channelId), JSON.stringify([...requests, request]), (err) => {
            if (err != null) throw err;
            return;
        });
    }

    public async removeRequest(channelId: string, request: Request): Promise<void> {
        const data: Request[] = await this.getRequests(channelId);

        const foundIndex = data.findIndex(v => isRequestsEqual(v, request));
        if (foundIndex === -1) throw new Error("RequestManager: Can not remove non-existing request.");
        
        delete data[foundIndex];
        this.redisClient.set(this.getRedisKey(channelId), JSON.stringify(data), (err) => {
            if (err != null) throw err;
            return;
        });
    }

    private getRedisKey(channelId: string) {
        return `channelRequests:${channelId}`
    }
}