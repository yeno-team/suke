import { ValidationError } from "../../exceptions/ValidationError";
import { RealtimeChannelData } from "../../types/UserChannelRealtime";
import { ValueObject } from "../../ValueObject";
import { ISentMessage } from "../SentMessage";
import { IReceivedMessage } from "../ReceivedMessage";
import { Request } from "../Request";

export type SocketMessageType = "TEST_EVENT" | "SERVER_ERROR" | "CLIENT_ERROR" | "SENT_CHAT_MESSAGE" | "RECEIVED_CHAT_MESSAGE" | "ROOM_JOIN" | "ROOM_LEAVE" | "CHANNEL_UPDATE" | "CHANNEL_REQUEST_ADD" | "CHANNEL_REQUEST_REMOVE" | "CHANNEL_REQUESTS_GET" | "CHANNEL_REQUESTS" | "SOCKET_DISCONNECT";

export interface IHasRoomId {
    roomId: string;
}

export type SocketMessageInput = {
    type: 'CLIENT_ERROR',
    data: string
} | {
    type: 'SERVER_ERROR',
    data: string
} | {
    type: 'TEST_EVENT',
    data: string
} | {
    type: 'SENT_CHAT_MESSAGE',
    data: ISentMessage
} | {
    type : "RECEIVED_CHAT_MESSAGE",
    data : IReceivedMessage
} | {
    type: 'ROOM_JOIN',
    data: IHasRoomId
} | {
    type: 'ROOM_LEAVE',
    data: IHasRoomId
} | {
    type: 'CHANNEL_UPDATE',
    data: Partial<RealtimeChannelData & {channelId: string}>
} | {
    type: 'CHANNEL_REQUEST_ADD',
    data: Request
} | {
    type: 'CHANNEL_REQUEST_REMOVE',
    data: Request
} | {
    type: 'CHANNEL_REQUESTS_GET',
    data: string // channel id
} | {
    type: 'CHANNEL_REQUESTS',
    data: Request[]
} | {
    type: 'SOCKET_DISCONNECT',
    data: string // webSocket id
}

export interface ISocketMessage {
    type: SocketMessageType;
    data: unknown;
}

export class SocketMessage extends ValueObject implements ISocketMessage {
    public type: SocketMessageType;
    public data: unknown;

    constructor(msg: SocketMessageInput) {
        super();
        this.type = msg.type;
        this.data = msg.data;

        if (!this.IsValid()) {
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
