import { SocketServer, WebSocketConnection } from "../server";


/**
 * Manager that handles creating rooms, and manages the connections in those rooms.
 */
export class RoomManager {
    /**
     * Map where the key is the room id
     */
    private connections: Map<string, Map<string, WebSocketConnection>>;

    constructor(private server: SocketServer) {
        this.connections = new Map();
    }

    public addUser(roomId: string, userSocket: WebSocketConnection): void {
        this.connections.set(roomId, this.connections.get(roomId).set(userSocket.id, userSocket));

        userSocket.on('close', () => {
            this.removeUser(roomId, userSocket);
        });
    }

    public removeUser(roomId: string, userSocket: WebSocketConnection): void {
       this.connections.get(roomId).delete(userSocket.id);
    }

    public getRoom(id: string): Map<string, WebSocketConnection> {
        const room = this.connections.get(id);

        if (room == null) {
            this.connections.set(id, new Map());
            return this.connections.get(id);
        }
        
        return room;
    }

    public CheckIfUserInRoom(userSocket: WebSocketConnection, roomId: string): boolean {
        let room = this.connections.get(roomId);

        if (room == null) {
            this.connections.set(roomId, new Map());
            room = this.connections.get(roomId);
        }

        return room.get(userSocket.id) != null;
    }
}