import { ValidationError } from "../../exceptions/ValidationError";
import { ValueObject } from "../../ValueObject";

export interface IHasUserId {
    userId: UserId;
}

export class UserId extends ValueObject {
    value: number;

    constructor(id: number) {
        super();
        this.value = id;

        if (!this.IsValid()) {
            throw new ValidationError(`id '${id} is not a valid UserId.`);
        }
    }

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.value;
        return;
    }

    protected IsValid(): boolean {
        return typeof(this.value) == 'number' && this.value != null;
    }
}