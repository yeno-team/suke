import { RoomManager } from "./RoomManager";

import { RedisClientType, SocketServer } from "../server";
import { Repository, getRepository } from "typeorm";
import { RealtimeTheaterRoomData } from "@suke/suke-core/src/types/UserChannelRealtime";
import { TheaterItemScheduleModel } from "@suke/suke-core/src/entities/TheaterItemSchedule";

/**
 * Manages realtime data for the theater rooms
 */
export class TheaterManager {
    /**
     * Key is the users name which is also the room name
     */
    private roomManager: RoomManager;
    private redisClient: RedisClientType;
    private server: SocketServer;
    private ITheaterItemScheduleRepo: Repository<TheaterItemScheduleModel >;

    constructor(private socketServer: SocketServer) {
        this.server = socketServer;
        this.redisClient = socketServer.getRedisClient();
        this.roomManager = socketServer.getRoomManager('theater');
        this.ITheaterItemScheduleRepo = getRepository(TheaterItemScheduleModel);
    }
    
    public async getRoom(roomId: string): Promise<RealtimeTheaterRoomData> {
        const key = this.getRedisKey(roomId);

        const val = await this.redisClient.get(key);

        if (val == null)
            return;

        return JSON.parse(val);
    }

    public async editRoom(roomId: string, editedData: Partial<RealtimeTheaterRoomData>) {
        const key = this.getRedisKey(roomId);
        const room = await this.getRoom(roomId);

        if (room == null) return;

        const updatedData: RealtimeTheaterRoomData = {
            ...room,
            ...editedData
        };

        await this.redisClient.set(key, JSON.stringify(updatedData));

        return updatedData;
    }

    private getRedisKey(key: string) {
        return `theater:rooms:${key}`;
    }
}