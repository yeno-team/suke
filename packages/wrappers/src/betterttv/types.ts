import { ValueObject } from "@suke/suke-core/src/ValueObject";
import { PropertyValidationError, ValidationError } from "@suke/suke-core/src/exceptions/ValidationError";

export interface IBetterTTVEmoteOptions {
    type : "trending" | "global" | "shared" | "top";
    limit? : number;
    before? : string;
    offset? : number;
    size? : "1x" | "2x" | "3x"
}

export interface BetterTTVRawEmote {
    id : string;
    code : string;
    imageType : "png" | "gif";
    user : {
        id : string;
        name : string;
        displayName : string;
        providerId : string;
    }
}

export interface BetterTTVEmote {
    url : URL;
    type : "png" | "gif"
}

export type BetterTTVEmoteApiResponse = Array<BetterTTVRawEmote>
export type BetterTTVEmoteResponse = Array<BetterTTVEmote>

export class BetterTTVEmoteOpts extends ValueObject implements IBetterTTVEmoteOptions {
    type: "trending" | "global" | "shared" | "top";
    limit?: number | undefined;
    before?: string | undefined;
    offset?: number | undefined;
    size?: "1x" | "2x" | "3x" | undefined;
    
    constructor(opts : IBetterTTVEmoteOptions) {
        super();
        this.type = opts.type;
        this.limit = opts.limit;
        this.before = opts.before;
        this.offset = opts.offset;
        this.size  = opts.size;

        if(!(this.IsValid)) {
            throw new ValidationError(`Incorrect BetterTTVEmote options : ${JSON.stringify(opts)}.`)
        }

    }

    protected* GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.type;
        yield this.limit;
        yield this.before;
        yield this.offset;
        yield this.size;
        return;
    }
    protected IsValid(): boolean {
        if(!(this.type)) {
            throw new PropertyValidationError("type property is missing.")
        }

        // if(!(this.type !== "trending") || !(this.type !== "global") || !(this.type !== "top") || !(this.type !== "shared")) {
        //     throw new PropertyValidationError("type property must contain the following values : trending , global , shared , top.")
        // }

        if(this.limit && typeof this.limit !== "number") {
            throw new PropertyValidationError("limit property is not a number.")
        }   

        if((this.limit) && (this.limit <= 0 || this.limit > 100)) {
            throw new PropertyValidationError("limit property must contain a value between 1 and 100.")
        }

        if(this.before && typeof this.before !== "string") {
            throw new PropertyValidationError("before property is not a string.")
        }

        if(this.offset && typeof this.offset !== "number") {
            throw new PropertyValidationError("offset property is not a number.")
        }

        if(this.size && typeof this.size !== "string") {
            throw new PropertyValidationError("size property is not a string.")
        }

        // if(!(this.size !== "1x") || !(this.size !== "2x") || !(this.size !== "3x")) {
        //     throw new PropertyValidationError("size property must contain the following values : 1x , 2x , 3x.")
        // }

        if((this.type === "shared") && (this.offset)) {
            throw new PropertyValidationError("type 'shared' does not require the offset property.")
        }

        if((this.type === "top" || this.type === "trending") && (this.before)) {
            throw new PropertyValidationError("type 'top' or 'trending' does not require the before property.")
        }

        if((this.type === "global") && (this.offset || this.before)) {
            throw new PropertyValidationError("type 'global' does not require the offset or before property.")
        }

        return true;
    }
    

}