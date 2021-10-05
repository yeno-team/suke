import { PropertyValidationError, ValidationError } from "../exceptions/ValidationError";
import { ValueObject } from "../ValueObject";

export interface IMessage {
    content: string;
    author_id: number;
}

export class Message extends ValueObject implements IMessage {
    content: string;
    author_id: number;

    constructor(msg: IMessage) {
        super();

        this.content = msg.content;
        this.author_id = msg.author_id;

        if (!this.IsValid()) {
            throw new ValidationError(`msg obj: ${JSON.stringify(msg)} is not valid.`);
        }
    }

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.content;
        yield this.author_id;

        return;
    }

    protected IsValid(): boolean {
        if (typeof(this.content) !== 'string') {
            throw new PropertyValidationError('content');
        }

        if (typeof(this.author_id) !== 'number') {
            throw new PropertyValidationError('author_id');
        }

        return true;
    }
}