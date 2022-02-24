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
    private theaterItemScheduleRepo: Repository<TheaterItemScheduleModel>;

    constructor(private socketServer: SocketServer) {
        this.server = socketServer;
        this.redisClient = socketServer.getRedisClient();
        this.roomManager = socketServer.getRoomManager('theater');
        this.theaterItemScheduleRepo = getRepository(TheaterItemScheduleModel);
    }
    
    public async getRoom(roomId: string): Promise<RealtimeTheaterRoomData> {
        const key = this.getRedisKey(roomId);

        const val = await this.redisClient.get(key);

        if (val == null)
            return;

        return JSON.parse(val);
    }

    private getRedisKey(key: string) {
        return `theater:rooms:${key}`;
    }
}