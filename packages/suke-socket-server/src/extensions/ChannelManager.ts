import { RoomManager } from "./RoomManager";
import { RealtimeChannelData } from '@suke/suke-core/src/types/UserChannelRealtime';

/**
 * Manages realtime data inside a user channel (video source, requests)
 */
export class ChannelManager {
    /**
     * Key is the users name whihc is also the room name
     */
    private channels: Map<string, RealtimeChannelData>

    constructor(private roomManager: RoomManager) {
        this.channels = new Map();
    }
}