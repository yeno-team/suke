import { SocketMessage } from "@suke/suke-core/src/entities/SocketMessage";
import { WebSocket } from "ws";
import { SocketServer } from "../../server";
import { Handler } from "../Handler";


export const createErrorHandler: Handler = (server: SocketServer) => (): void => {
    server.on('error', (err: Error) => {
        console.error(err);
    });
};

export const createClientErrorHandler: Handler = (server: SocketServer) => (): void => {
    server.on('clientError', (err: Error, ws: WebSocket) => {
        const response = new SocketMessage({
            type: 'CLIENT_ERROR',
            data: err.message
        });

        ws.send(JSON.stringify(response));
        console.error(err);
    });
};