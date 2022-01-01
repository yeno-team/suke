import { PropertyValidationError, ValidationError } from "../../exceptions/ValidationError";
import { ValueObject } from "../../ValueObject";
import { Author } from "../User";
import { MessageEmoji } from "@suke/suke-core/src/types/Emoji";

export interface IMessage {
    content: string;
    author: Author;
    channelId: string;
    emojis : Array<MessageEmoji>;
}

export class Message extends ValueObject implements IMessage {
    content: string;
    author: Author;
    channelId: string;
    emojis : Array<MessageEmoji>;

    constructor(msg: IMessage) {
        super();

        this.content = msg.content;
        this.author = msg.author;
        this.channelId = msg.channelId;
        this.emojis = msg.emojis;

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

        return true;
    }
}