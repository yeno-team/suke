import { RateLimiterRedis } from "rate-limiter-flexible";
import { PropertyValidationError } from "../../exceptions/ValidationError";
import { ValueObject } from "../../ValueObject";

export interface IRateLimterOpts {
    key : string,
    limiter : RateLimiterRedis,
    pointsToConsume? : number,
    errorMessage? : string;
    isGlobalLimiter? : boolean,
    setHeaders? : boolean,
}

export class RateLimiterOpts extends ValueObject implements IRateLimterOpts {
    public key: string;
    public limiter: RateLimiterRedis;
    public pointsToConsume?: number;
    public errorMessage?: string;
    public isGlobalLimiter?: boolean;
    public setHeaders?: boolean;
    
    constructor(opts : IRateLimterOpts) {
        super();

        this.key = opts.key;
        this.limiter = opts.limiter;
        this.pointsToConsume = opts.pointsToConsume;
        this.errorMessage = opts.errorMessage;
        this.isGlobalLimiter = opts.isGlobalLimiter;
        this.setHeaders = opts.setHeaders;

        this.IsValid();
    }

    public* GetEqualityProperties(): Generator<unknown, unknown, unknown> {
        yield this.key;
        yield this.limiter;
        yield this.pointsToConsume;
        yield this.errorMessage;
        yield this.isGlobalLimiter;
        yield this.setHeaders;
        return;
    }


    protected IsValid(): boolean {
        if(typeof(this.key) !== "string") {
            throw new PropertyValidationError("key property must be a string.");
        }

        if(!(this.limiter instanceof RateLimiterRedis)) {
            throw new PropertyValidationError("limiter property must be an instance of RateLimterRedis.");
        }

        if(this.pointsToConsume && typeof(this.pointsToConsume) !== "number") {
            throw new PropertyValidationError("pointsToConsume property must be a number.");
        }

        if(this.errorMessage && typeof(this.errorMessage) !== "string") {
            throw new PropertyValidationError("errorMessage property must be a string.");
        }

        if(this.isGlobalLimiter && typeof(this.isGlobalLimiter) !== "boolean") {
            throw new PropertyValidationError("isGlobalLimiter property must be a boolean value.");
        }

        if(this.setHeaders && typeof(this.setHeaders) !== "boolean") {
            throw new PropertyValidationError("setHeaders property must be a boolean value.");
        }

        return true;
    }
    
}