import { ValueObject } from "../../ValueObject";
import { Author } from "../User";
import { ValidationError , PropertyValidationError } from "../../exceptions/ValidationError";
import { ISentMessage } from "../SentMessage";
import { Emoji } from "../../types/Emoji";
import { ParsedEmoji } from "@suke/suke-util/src/parseEmojis";

export type IReceivedMessage = ISentMessage & { emojis : Array<(Emoji & ParsedEmoji)>}

export class ReceivedMessage extends ValueObject implements IReceivedMessage {    
    content: string;
    author: Author;
    channelId: string;
    emojis : Array<Emoji & ParsedEmoji>;

    constructor(msg: IReceivedMessage) {
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

        if(!(Array.isArray(this.emojis))) {
            throw new PropertyValidationError("emojis")
        }

        return true;
    }
}