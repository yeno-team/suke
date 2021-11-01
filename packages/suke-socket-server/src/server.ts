import WebSocket from 'ws';
import EventEmitter from "events"
import { Server, IncomingMessage} from 'http'
import { RequestHandler, Request, Response} from 'express';
import TypedEmitter from "typed-emitter";
import handlers from './handlers';
import { IHasUser, User } from '@suke/suke-core/src/entities/User';
import { SocketMessage } from '@suke/suke-core/src/entities/SocketMessage';
import { UserId } from '@suke/suke-core/src/entities/UserId';
import { isValidJson } from '@suke/suke-util/';


export interface SocketServerEvents {
    error: (error: Error) => void,
    clientError: (error: Error, ws: WebSocket) => void,
    message: (json: SocketMessage, ws: WebSocket) => void
}

export type UserDataWithWebSocket = {
    user: User,
    ws: WebSocket
}

/**
 * This type extends the interface IHasUserId to the session property. This allows usage of userId which is eventually passed in from express.
 * It also extends Request from ws and IncomingMessage to allow usage of those.
 */
type EventRequest = Request & IncomingMessage & {session: IHasUser};

export class SocketServer extends(EventEmitter as new () => TypedEmitter<SocketServerEvents>) {
    private server: Server;
    private wss: WebSocket.Server;
    private userMap: Map<number, UserDataWithWebSocket>;

    constructor(httpServer: Server, sessionParser: RequestHandler) {
        super();
        const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

        httpServer.on('upgrade', (req: EventRequest, socket, head) => {
            sessionParser(req, {} as Response, () => {
                if (!req.session.user) {
                    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                    socket.destroy();
                    return;
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

        this.createHandlers();
        this.setupListeners();
    }

    private setupListeners(): void {
        this.wss.on('connection', (ws, req: EventRequest) => {
            try {
                const user = new User(req.session.user as User);

                this.userMap.set(user.id, {user, ws});

                ws.on('message', (message) => {
                    const msgStr = message.toString();

                    if (!isValidJson(msgStr))
                        return this.emit('clientError', new Error("Invalid Message from client."), ws);

                    const msgJson = JSON.parse(message.toString());

                    this.emit('message', new SocketMessage(msgJson), ws);
                });

                ws.on('error', (err) => {
                    this.emit('error', err);
                });

                ws.on('close', () => {
                    this.userMap.delete(user.id);
                });
            } catch (e) {
                this.emit('error', e as Error);
            }
        });

        this.wss.on('error', (err) => {
            this.emit('error', err);
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

    public getAllConnections(): Map<number, UserDataWithWebSocket> {
        return this.userMap;
    }

    /**
     * Broadcast/send data to all connected users ignoring users in the ignoreList.
     * 
     * @param data Data to broadcast
     * @param ignoreList user ids to ignore
     */
    public broadcast(data: unknown, ignoreList: UserId[]): void {
        this.userMap.forEach((v) => {
            if (ignoreList.every((ignoredUserId) => !v.user.Id().Equals(ignoredUserId))) 
                return;
            
            v.ws.send(data);
        });
    }

    public start(port: number, cb: () => void): void {
        this.server.listen(port, cb);
    }
}