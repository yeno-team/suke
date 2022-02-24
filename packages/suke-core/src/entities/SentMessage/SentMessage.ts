import { PropertyValidationError, ValidationError } from "../../exceptions/ValidationError";
import { ValueObject } from "../../ValueObject";
import { Author } from "../User";

export interface ISentMessage {
    content: string;
    author: Author;
    channelId: string;
    channel: string;
}
export class SentMessage extends ValueObject implements ISentMessage {    
    content: string;
    author: Author;
    channelId: string;
    channel: string;

    constructor(msg: ISentMessage) {
        super();

        this.content = msg.content;
        this.author = msg.author;
        this.channelId = msg.channelId;
        this.channel = msg.channel;

        if (!this.IsValid()) {
            throw new ValidationError(`msg obj: ${JSON.stringify(msg)} is not valid.`);
        }
    }

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.content;
        yield this.author;

        return;
    }

    protected IsValid(): boolean {
        if (typeof(this.content) !== 'string') {
            throw new PropertyValidationError('content');
        }

        if (typeof(this.author) !== "object") {
            throw new PropertyValidationError('author');
        }

        if (typeof(this.channelId) !== "string") {
            throw new PropertyValidationError('channelId');
        }

        if (typeof(this.channel) !== "string") {
            throw new PropertyValidationError('channel');
        }

        return true;
    }
}