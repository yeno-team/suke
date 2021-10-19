import { ValueObject } from "../ValueObject";
import { ValidationError } from "../exceptions/ValidationError";
import { isValidUrl } from "@suke/suke-util/src"

export class Url extends ValueObject {
    constructor(public url : string) {
        super();

        if(!this.IsValid()) {
            throw new ValidationError("Invalid url")
        }
    }

    protected *GetEqualityProperties(): Generator<unknown, any, unknown> {
        yield this.url
    }
    protected IsValid(): boolean {
        return !!this.url && typeof(this.url) === "string" && isValidUrl(this.url)
    }    
}