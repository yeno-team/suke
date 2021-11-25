import { ValidationError } from "../../exceptions/ValidationError";
import { RealtimeChannelData } from "../../types/UserChannelRealtime";
import { ValueObject } from "../../ValueObject";
import { IMessage } from "../Message";

export type SocketMessageType = "TEST_EVENT" | "SERVER_ERROR" | "CLIENT_ERROR" | "CHAT_MESSAGE" | "ROOM_JOIN" | "ROOM_LEAVE" | "ROOM_UPDATE";

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
    type: 'CHAT_MESSAGE',
    data: IMessage
} | {
    type: 'ROOM_JOIN',
    data: IHasRoomId
} | {
    type: 'ROOM_LEAVE',
    data: IHasRoomId
} | {
    type: 'ROOM_UPDATE',
    data: RealtimeChannelData
};

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
