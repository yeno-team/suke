import { SocketMessage } from "@suke/suke-core/src/entities/SocketMessage";
import { RedisClientType, SocketServer } from "../server";
import { BroadcasterOptions } from "./Broadcaster";

/**
 * Manager that handles creating rooms, and manages the connections in those rooms.
 * 
 * Rooms are stored in redis as aan array of connection ids.
 */
export class RoomManager {
    private redisClient: RedisClientType;

    constructor(private prefix: string = "", private server: SocketServer) {
        this.redisClient = server.getRedisClient();
    }

    public async addUser(roomId: string, userSocketId: string): Promise<void> {
        const key = this.getRedisKey(roomId);
        const connections = await this.getRoom(roomId);

        await this.redisClient.set(key, JSON.stringify([...connections, userSocketId]));
    }

    public async removeUser(roomId: string, userSocketId: string): Promise<void> {
        const key = this.getRedisKey(roomId);
        const connections: string[] = await this.getRoom(roomId);
        await this.redisClient.set(key, JSON.stringify(connections.filter(v => v !== userSocketId)));
    }

    /**
     * Get a Room connections
     * @param id 
     * @returns string of connection ids
     */
    public async getRoom(id: string): Promise<string[]> {
        const val = await this.redisClient.get(this.getRedisKey(id));
        
        if (val == null) {
            await this.redisClient.set(this.getRedisKey(id), JSON.stringify([]));
            return [];
        }

        return JSON.parse(val);
    }

    public async CheckIfUserInRoom(connection: string, roomId: string): Promise<boolean> {
        const roomConnections = await this.getRoom(roomId);
        return Promise.resolve(roomConnections.find(v => v === connection) != null);
    }

    public async broadcastToRoom(data: SocketMessage, roomId: string, opts?: BroadcasterOptions): Promise<void> {
        const roomConnections = await this.getRoom(roomId);

        roomConnections.forEach(async id => {
            if (opts != null) {
                if (opts.blacklist?.indexOf(id) !== -1) 
                    return;

                if (opts.whitelist?.indexOf(id) === -1) {
                    return;
                }
            }
        
            const connection = this.server.getConnection(id);
            if (connection == null) {
                await this.removeUser(roomId, id);
            } else {
                connection.send(JSON.stringify(data));
            }
        });
    }

    private getRedisKey(roomId: string) {
        return `room:${this.prefix+roomId.toLowerCase()}`;
    }

}