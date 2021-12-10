import { SocketMessageInput } from "@suke/suke-core/src/entities/SocketMessage";
import { RedisClient } from "redis";
import { SocketServer } from "../server";

/**
 * Manager that handles creating rooms, and manages the connections in those rooms.
 * 
 * Rooms are stored in redis as aan array of connection ids.
 */
export class RoomManager {
    private redisClient: RedisClient;

    constructor(private server: SocketServer) {
        this.redisClient = server.getRedisClient();
    }

    public async addUser(roomId: string, userSocketId: string): Promise<void> {
        const key = this.getRedisKey(roomId);
        const connections = await this.getRoom(roomId);

        this.redisClient.set(key, JSON.stringify([...connections, userSocketId]), (err) => {
            if (err != null) throw err;
            return;
        });
    }

    public async removeUser(roomId: string, userSocketId: string): Promise<void> {
        const connections: string[] = await this.getRoom(roomId);
        this.redisClient.set(roomId, JSON.stringify(connections.filter(v => v !== userSocketId)), (err) => {
            if (err != null) throw err;
            return;
        });
    }

    /**
     * Get a Room connections
     * @param id 
     * @returns string of connection ids
     */
    public getRoom(id: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.redisClient.get(this.getRedisKey(id), (err, reply) => {
                if (err != null) return reject(err);
                if (reply == null) {
                    this.redisClient.set(this.getRedisKey(id), JSON.stringify([]), (err) => {
                        if (err != null) return reject(err);
                        return resolve([]);
                    });
                } else {
                    return resolve(JSON.parse(reply));
                }
            })
        });
    }

    public async CheckIfUserInRoom(userId: string, roomId: string): Promise<boolean> {
        const roomConnections = await this.getRoom(roomId);
        return Promise.resolve(roomConnections.find(v => v === userId) != null);
    }

    private getRedisKey(roomId: string) {
        return `room:${roomId}`;
    }

}