import WebSocket from 'ws';
import {v4 as uuid } from 'uuid';
import EventEmitter from "events";
import { Server, IncomingMessage} from 'http';
import { RequestHandler, Request, Response} from 'express';
import TypedEmitter from "typed-emitter";
import { IHasUser, User } from '@suke/suke-core/src/entities/User';
import { SocketMessage } from '@suke/suke-core/src/entities/SocketMessage';
import { isValidJson } from '@suke/suke-util/';
import { IHasId } from '@suke/suke-core/src/IHasId';
import { Role } from '@suke/suke-core/src/Role';
import { UserChannel } from '@suke/suke-core/src/entities/UserChannel/UserChannel';
import { RoomManager } from './extensions/RoomManager';
import { RedisClient } from "@suke/suke-server/src/config";
import { CategoryManager } from './extensions/CategoryManager';
import { Name } from '@suke/suke-core/src/entities/Name/Name';

export interface SocketServerEvents {
    error: (error: Error) => void,
    clientError: (error: Error, ws: WebSocket) => void,
    message: (json: SocketMessage, ws: WebSocket, user?: User) => void
}

export type UserDataWithWebSocket = {
    user: User,
    ws: WebSocketConnection
}

export type WebSocketConnection = WebSocket & IHasId<string> & { isAlive: boolean, remoteAddress: string };

/**
 * This type extends the interface IHasUser to the session property. This allows usage of user object which is eventually passed in from express.
 * It also extends Request from ws and IncomingMessage to allow usage of those.
 */
type EventRequest = Request & IncomingMessage & {session: IHasUser};

export type RedisClientType = typeof RedisClient;

export interface SocketServerConfig {
    httpServer: Server,
    sessionParser: RequestHandler,
    redisClient: RedisClientType
}

export class SocketServer extends (EventEmitter as unknown as new () => TypedEmitter<SocketServerEvents>) {
    private server: Server;
    private wss: WebSocket.Server;

    // Map uses the websocket id as key
    private guestMap: Map<string, WebSocketConnection>;

    // Map uses the user's name
    private userMap: Map<string, UserDataWithWebSocket>;
    private roomManager: RoomManager;
    private categoryManager: CategoryManager;
    
    public connections: Map<string, WebSocketConnection>;
    private _redisClient: RedisClientType;

    constructor({httpServer, sessionParser, redisClient }: SocketServerConfig) {
        super();

        const wss = new WebSocket.Server({ clientTracking: false, noServer: true });
        
        httpServer.on('upgrade', (req: EventRequest, socket, head) => {
            sessionParser(req, {} as Response, () => {
                if (!req.session.user) {
                    /* 
                    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                    socket.destroy();
                    return;
                    */
                   
                    // ASSUME USER IS A GUEST
                    req.session.user = new User({
                        id: 0,
                        email: 'guest@suke.app',
                        name: 'Guest',
                        role: Role.Guest,
                        following: [],
                        channel: new UserChannel({
                            id: 0,
                            followers: [],
                            desc: "",
                            desc_title: "",
                            roledUsers: []
                        })
                    });
                }
    
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                wss.handleUpgrade(req, socket as any, head, function(ws) {
                    wss.emit('connection', ws, req);
                });
            });
        });

        this._redisClient = redisClient;
        this.server = httpServer;
        this.wss = wss;
        this.userMap = new Map();
        this.guestMap = new Map();
        this.connections = new Map();
        this.roomManager = new RoomManager(this);
        this.categoryManager = new CategoryManager(this);
        this.setup();
    }

    /**
     * The initial setup function of the socket server.
     * Listens to every new user connection and maps them either as guest or user.
     */
    private setup(): void {
        this.wss.on('connection', (ws: WebSocketConnection, req: EventRequest) => {
            try {
                ws.id = uuid();
                ws.isAlive = true;
                ws.remoteAddress = req.socket.remoteAddress;

                const user = new User(req.session.user as User);

                console.log(user.name + " Connected!");
                
                if (user.id == 0) {
                    this.guestMap.set(ws.id, ws);
                } else {
                    this.userMap.set(user.name, {user, ws});
                }

                this.connections.set(ws.id, ws);
                
                ws.on('message' , (message) => {
                    const msgStr = message.toString();
                    if (!isValidJson(msgStr))
                        return this.emit('clientError', new Error("Invalid Message from client."), ws);

                    // SyntaxError: Unexpected token } in JSON at position 6.
                    // If the user inputs {"123"}
                    const msgJson = JSON.parse(message.toString());
                    this.emit('message', new SocketMessage(msgJson), ws, user);
                });

                ws.on('error', (err) => {
                    this.emit('error', err);
                });

                ws.on('close', () => {
                    if (user.id == 0) {
                        this.guestMap.delete(ws.id);
                        return;
                    }

                    this.connections.delete(ws.id);
                    this.userMap.delete(user.name);
                    this.emit('message', new SocketMessage({
                        type: 'SOCKET_DISCONNECT',
                        data: ws.id
                    }), ws, user);

                    console.log(user.name + " Disconnected.");
                });
            } catch (e) {
                this.emit('error', e as Error);
            }
        });

        this.wss.on('error', (err) => {
            this.emit('error', err);
        });

        this.wss.on('close', () => {
            console.warn("Socket Server exited.");
        });
    }

    public getConnections(): Map<string, WebSocketConnection> {
        return this.connections;
    }

    /**
     * 
     * @param id socket id
     * @returns Websocket Connection
     */
    public getConnection(id: string): WebSocketConnection | undefined {
        return this.connections.get(id);
    }

    public getUserConnection(nameObj: Name): UserDataWithWebSocket | undefined {
        return this.userMap.get(nameObj.name);
    }

    public getUserConnections(): Map<string, UserDataWithWebSocket> {
        return this.userMap;
    }

    public getGuestConnection(id: string): WebSocketConnection | undefined {
        return this.guestMap.get(id);
    }

    public getGuestConnections(): Map<string, WebSocketConnection> {
        return this.guestMap;
    }

    public getRoomManager(): RoomManager {
        return this.roomManager;
    }

    public getCategoryManager(): CategoryManager {
        return this.categoryManager;
    }

    public getRedisClient(): RedisClientType {
        return this._redisClient;
    }

    public start(port: number, cb: () => void): void {
        this.server.listen(port, cb);
    }
}