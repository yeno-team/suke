import WebSocket from 'ws';
import { v4 as uuid } from 'uuid';
import EventEmitter from "events"
import { Server, IncomingMessage} from 'http'
import { RequestHandler, Request, Response} from 'express';
import TypedEmitter from "typed-emitter";
import handlers from './handlers';
import { IHasUser, User } from '@suke/suke-core/src/entities/User';
import { SocketMessage } from '@suke/suke-core/src/entities/SocketMessage';
import { UserId } from '@suke/suke-core/src/entities/UserId';
import { isValidJson } from '@suke/suke-util/';
import { IHasId } from '@suke/suke-core/src/IHasId';
import { Role } from '@suke/suke-core/src/Role';
import { UserChannel } from '@suke/suke-core/src/entities/UserChannel/UserChannel';

export interface SocketServerEvents {
    error: (error: Error) => void,
    clientError: (error: Error, ws: WebSocket) => void,
    message: (json: SocketMessage, ws: WebSocket) => void
}

export type UserDataWithWebSocket = {
    user: User,
    ws: WebSocketConnection
}

export type WebSocketConnection = WebSocket & IHasId<string> & { isAlive: boolean };

/**
 * This type extends the interface IHasUser to the session property. This allows usage of user object which is eventually passed in from express.
 * It also extends Request from ws and IncomingMessage to allow usage of those.
 */
type EventRequest = Request & IncomingMessage & {session: IHasUser};

export class SocketServer extends(EventEmitter as new () => TypedEmitter<SocketServerEvents>) {
    private server: Server;
    private wss: WebSocket.Server;

    // Map uses the websocket id as key
    private guestMap: Map<string, WebSocketConnection>;
    private userMap: Map<number, UserDataWithWebSocket>;
    
    public connections: WebSocketConnection[] = [];

    constructor(httpServer: Server, sessionParser: RequestHandler) {
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
                        channel: new UserChannel({
                            id: 0,
                            followers: 0,
                            desc: "",
                            desc_title: ""
                        })
                    });
                }
    
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                wss.handleUpgrade(req, socket as any, head, function(ws) {
                    wss.emit('connection', ws, req);
                });
            });
        });

        this.server = httpServer;
        this.wss = wss;
        this.userMap = new Map();
        this.guestMap = new Map();

        this.createHandlers();
        this.setupListeners();
    }

    private setupListeners(): void {
        this.wss.on('connection', (ws: WebSocketConnection, req: EventRequest) => {
            try {
                ws.id = uuid();
                ws.isAlive = true;

                const user = new User(req.session.user as User);

                console.log(user.name + " Connected!");

                if (user.id == 0) {
                    this.guestMap.set(ws.id, ws);
                } else {
                    this.userMap.set(user.id, {user, ws});
                }

                this.connections.push(ws);
                
                ws.on('message', (message) => {
                    const msgStr = message.toString();

                    if (!isValidJson(msgStr))
                        return this.emit('clientError', new Error("Invalid Message from client."), ws);

                    const msgJson = JSON.parse(message.toString());

                    console.log(msgJson);

                    this.emit('message', new SocketMessage(msgJson), ws);
                });

                ws.on('error', (err) => {
                    this.emit('error', err);
                });

                ws.on('close', () => {
                    if (user.id == 0) {
                        this.guestMap.delete(ws.id);
                        return;
                    }

                    delete this.connections[this.connections.findIndex(v => v != null && ws != null && v.id === ws.id)];
                    
                    this.userMap.delete(user.id);
                });
            } catch (e) {
                this.emit('error', e as Error);
            }
        });

        this.wss.on('error', (err) => {
            this.emit('error', err);
        });

        /**
         * Checks if clients are alive by seeing if they respond to a ping
         */
        const pingTimer = setInterval(() => {
            if (this.wss.clients == null)
                return;
                
            this.wss.clients.forEach((ws: WebSocketConnection) => {
                if (ws.isAlive === false) 
                    return ws.terminate();
                
                ws.isAlive = false;
                ws.ping();
            })
        }, 30000);

        this.wss.on('close', () => {
            clearInterval(pingTimer);
        });
    }

    /**
     * Creates Handlers for the server's events
     */
    private createHandlers(): void {
        for (const createHandler of handlers) {
            createHandler(this)();
        }
    }


    public getConnection(idObj: UserId): UserDataWithWebSocket | undefined {
        return this.userMap.get(idObj.value);
    }

    public getUserConnections(): Map<number, UserDataWithWebSocket> {
        return this.userMap;
    }

    public getGuestConnection(id: string): WebSocketConnection | undefined {
        return this.guestMap.get(id);
    }

    public getGuestConnections(): Map<string, WebSocketConnection> {
        return this.guestMap;
    }

    /**
     * Broadcast/send data to all connected users ignoring users in the ignoreList.
     * 
     * @param data Data to broadcast
     * @param ignoreList socket ids to ignore
     */
    public broadcast(data: SocketMessage, ignoreList: string[]): void {
        this.connections.forEach((v: WebSocketConnection) => {
            if (ignoreList.indexOf(v.id) !== -1) 
                return;

            v.send(JSON.stringify(data));
        });
    }

    public start(port: number, cb: () => void): void {
        this.server.listen(port, cb);
    }
}