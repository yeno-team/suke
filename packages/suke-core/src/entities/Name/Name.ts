import { PropertyValidationError, ValidationError } from "../../exceptions/ValidationError";
import { ValueObject } from "../../ValueObject";

export interface IName {
    name: string;
}

export class Name extends ValueObject implements IName {
    public name: string;

    constructor (_name: string) {
        super();
        this.name = _name.toLowerCase();

        if (!this.IsValid()) {
            throw new ValidationError(`'${_name}' is not a valid Name.`);
        }
    }

    protected *GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.name;
        return;
    }

    protected IsValid(): boolean {
        if (typeof(this.name) != 'string') {
            throw new PropertyValidationError('name');
        }

        if (!/^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(this.name)) {
            return false;
        }

        return true;
    }

}