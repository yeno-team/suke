import WebSocket from 'ws';
import EventEmitter from "events"
import { Server, IncomingMessage} from 'http'
import { RequestHandler, Request, Response} from 'express';
import TypedEmitter from "typed-emitter";
import { ValueObject } from '@suke/suke-core/src/ValueObject';
import { ValidationError } from '@suke/suke-core/src/exceptions/ValidationError';
import { IHasUserId } from 'packages/suke-core/src/entities/UserId/UserId';
import handlers from './handlers';
import { User } from '@suke/suke-core/src/entities/User';
import { UserId } from '@suke/suke-core/src/entities/UserId';


export interface SocketServerMessage {
    type: string;
    data: unknown;
}

export class SocketServerMessage extends ValueObject implements SocketServerMessage {
    public type: string;
    public data: unknown;

    constructor(msg: SocketServerMessage) {
        super();
        this.type = msg.type;
        this.data = msg.data;

        if (this.IsValid()) {
            throw new ValidationError(`object ${JSON.stringify(msg)} is not a valid socket server message`);
        }
    }

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.type;
        yield this.data;
        return;
    }

    protected IsValid(): boolean {
        return typeof(this.type) == 'string' && this.type != null;
    }
}

export interface SocketServerEvents {
    error: (error: Error) => void,
    message: (json: SocketServerMessage) => void
}

export type UserDataWithWebSocket = {
    user: User,
    ws: WebSocket
}

/**
 * This type extends the interface IHasUserId to the session property. This allows usage of userId which is eventually passed in from express.
 * It also extends Request from ws and IncomingMessage to allow usage of those.
 */
type EventRequest = Request & IncomingMessage & {session: IHasUserId};

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

        this.setupListeners();
    }

    private setupListeners(): void {
        this.wss.on('connection', (ws, req: EventRequest) => {
            try {
                const user = new User(req.session.user as User);

                this.userMap.set(user.id, {user, ws});

                ws.on('message', (message) => {
                    const msgJson = JSON.parse(message.toString());

                    this.emit('message', new SocketServerMessage(msgJson));
                });

                ws.on('close', () => {
                    this.userMap.delete(user.id);
                });

                this.createHandlers();
            } catch (e) {
                this.emit('error', e as Error);
            }
        });
    }

    private createHandlers(): void {
        handlers.map((createHandler) => createHandler(this));
    }

    public getUserConnection(idObj: UserId): void {
        this.userMap.get(idObj.value);
    }

    public start(port: number, cb: () => void): void {
        this.server.listen(port, cb);
    }
}