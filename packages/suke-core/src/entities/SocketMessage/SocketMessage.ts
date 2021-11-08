import { ValidationError } from "../../exceptions/ValidationError";
import { ValueObject } from "../../ValueObject";

export type SocketMessageType = "TEST_EVENT" | "SERVER_ERROR" | "CLIENT_ERROR";

export type SocketMessageInput = {
    type: 'CLIENT_ERROR',
    data: Error
} | {
    type: 'SERVER_ERROR',
    data: Error
} | {
    type: 'TEST_EVENT',
    data: string
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
