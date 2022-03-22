import { Response } from "express";
import { RateLimiterRes } from "rate-limiter-flexible";
import { RateLimiterOpts } from "@suke/suke-core/src/entities/RateLimiterOpts";

export interface CreateRateLimiterResponse {
    isRateLimited : boolean
}

export const handleRateLimiter = async (response : Response , opts : RateLimiterOpts) : Promise<CreateRateLimiterResponse> => {
    let resp : RateLimiterRes;
    let isRateLimited = false;

    try {
        resp = await opts.limiter.consume(opts.key , opts.pointsToConsume ?? 1);
    } catch (e) {
        // If there is not enough points to consume , it will throw the limiter response as an error.
        isRateLimited = true;
        resp = e as RateLimiterRes;
    }

    if(opts.setHeaders ?? true) { 
        response.set("X-RateLimit-Limit", (opts.limiter.points).toString());
        response.set("Retry-After", (resp.msBeforeNext / 1000).toString());
        response.set("X-RateLimit-Remaining" , (resp.remainingPoints).toString());
        response.set("X-RateLimit-Reset" , (new Date(Date.now() + resp.remainingPoints)).toString());

        // Only will return this header if it is a global rate limit and not per route.
        opts.isGlobalLimiter ? response.set("X-RateLimit-Global" , "") : response.removeHeader("X-RateLimit-Global");
    }

    if(isRateLimited) {
        response.status(429).json({
            message : opts.errorMessage || "You are being rate limited.",
            retry_after : (resp.msBeforeNext / 1000).toString(),
            global : opts.isGlobalLimiter ?? false
        });
    }   

    if(!(response.locals.limiters)) {
        response.locals.limiters = [];
    }

    response.locals.limiters.push(opts);

    return {
        isRateLimited
    };
};