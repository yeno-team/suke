import WebSocket from 'ws';
import { Server, IncomingMessage} from 'http'

import { RequestHandler, Request, Response} from 'express';
import { IUser } from '@suke/suke-core/dist/entities/User';

export class SocketServer {
    private wss: WebSocket.Server;
    private users: Map<number, WebSocket>;

    constructor(httpServer: Server, sessionParser: RequestHandler) {
        const wss = new WebSocket.Server({ clientTracking: false, noServer: true });

        httpServer.on('upgrade', (req: Request & IncomingMessage, socket, head) => {
            sessionParser(req, {} as Response, () => {
                if (!req.session.id) {
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

        this.wss = wss;
        this.users = new Map();
    }

    private setupListeners(): void {
        this.wss.on('connection', (ws, req: Request & IncomingMessage) => {
            const userId =  req.session.id;
    
            
        });
    }
}