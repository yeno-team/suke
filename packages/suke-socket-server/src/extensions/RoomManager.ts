import { SocketServer, WebSocketConnection } from "../server";


export class RoomManager {
    /**
     * Map where the key is the room id
     */
    private rooms: Map<string, WebSocketConnection[]>;

    constructor(private server: SocketServer) {
        this.rooms = new Map();
    }

    public addUser(roomId: string, userSocket: WebSocketConnection): void {
        this.rooms.set(roomId, [...this.rooms.get(roomId), userSocket]);

        userSocket.on('close', () => {
            this.removeUser(roomId, userSocket);
        });
    }

    public removeUser(roomId: string, userSocket: WebSocketConnection): void {
        this.rooms.set(roomId, [...this.rooms.get(roomId).filter(v => v.id !== userSocket.id)]);
    }

    public getRoom(id: string): WebSocketConnection[] {
        const room = this.rooms.get(id);

        if (room == null) {
            this.rooms.set(id, []);
            return [];
        }
        
        return room;
    }

    public CheckIfUserInRoom(userSocket: WebSocketConnection, roomId: string): boolean {
        let room = this.rooms.get(roomId);

        if (room == null) {
            this.rooms.set(roomId, []);
            room = [];
        }

        return room.find(v => v.id === userSocket.id) != null;
    }
}