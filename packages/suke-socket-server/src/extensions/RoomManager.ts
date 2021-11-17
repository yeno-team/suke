import { SocketServer, WebSocketConnection } from "../server";


/**
 * Manager that handles creating rooms, and manages the connections in those rooms.
 */
export class RoomManager {
    /**
     * Map where the key is the room id
     */
    private conections: Map<string, WebSocketConnection[]>;

    constructor(private server: SocketServer) {
        this.conections = new Map();
    }

    public addUser(roomId: string, userSocket: WebSocketConnection): void {
        this.conections.set(roomId, [...this.conections.get(roomId), userSocket]);

        userSocket.on('close', () => {
            this.removeUser(roomId, userSocket);
        });
    }

    public removeUser(roomId: string, userSocket: WebSocketConnection): void {
        this.conections.set(roomId, [...this.conections.get(roomId).filter(v => v.id !== userSocket.id)]);
    }

    public getRoom(id: string): WebSocketConnection[] {
        const room = this.conections.get(id);

        if (room == null) {
            this.conections.set(id, []);
            return [];
        }
        
        return room;
    }

    public CheckIfUserInRoom(userSocket: WebSocketConnection, roomId: string): boolean {
        let room = this.conections.get(roomId);

        if (room == null) {
            this.conections.set(roomId, []);
            room = [];
        }

        return room.find(v => v.id === userSocket.id) != null;
    }
}