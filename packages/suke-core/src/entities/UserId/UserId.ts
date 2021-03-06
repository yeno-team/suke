import { ValidationError } from "../../exceptions/ValidationError";
import { IComparable } from "../../types/IComparable";
import { ValueObject } from "../../ValueObject";

export interface IHasUserId {
    userId: UserId;
}

export class UserId extends ValueObject implements IComparable {
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
        if (this.value == null) {
            this.value = -1;
        }

        return typeof(this.value) == 'number' && this.value != null;
    }

    public CompareTo(object: UserId): boolean {
        return this.value > object.value;
    }
}