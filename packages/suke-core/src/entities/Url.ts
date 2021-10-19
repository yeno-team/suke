import { ValueObject } from "../ValueObject";
import { ValidationError } from "../exceptions/ValidationError";
import { isValidUrl } from "@suke/suke-util/src"

export class Url extends ValueObject {
    public address : string;

    constructor(address : string) {
        super();
        this.address = address;

        if(!this.IsValid()) {
            throw new ValidationError("Invalid url")
        }
    }

    protected *GetEqualityProperties(): Generator<unknown, any, unknown> {
        yield this.address
    }

    protected IsValid(): boolean {
        return !!this.address && typeof(this.address) === "string" && isValidUrl(this.address)
    }    
}