import { Response } from "express";
import { RateLimiterAbstract , RateLimiterRes } from "rate-limiter-flexible";

export interface setRateLimiterOpts {
    key : string;
    limiter : RateLimiterAbstract;
    global : boolean;
    pointsToConsume : number;
}

export const setRateLimiter = async (response : Response , opts : setRateLimiterOpts) : Promise<Response> => {
    let resp : RateLimiterRes;
    let isRateLimited = false;

    try {
        resp = await opts.limiter.consume(opts.key , opts.pointsToConsume)
    } catch (e) {
        // If there is not enough points to consume , it will throw the limiter response as an error.
        isRateLimited = true
        resp = e as RateLimiterRes
    }

    response.set("X-RateLimit-Limit", (opts.limiter.points).toString())
    response.set("Retry-After", (resp.msBeforeNext / 1000).toString())
    response.set("X-RateLimit-Remaining" , (resp.remainingPoints).toString())
    response.set("X-RateLimit-Reset" , (new Date(Date.now() + resp.remainingPoints)).toString())
    
    // Only will return this header if it is a global rate limit and not per route.
    if(opts.global) {
        response.set("X-RateLimit-Global" , "")
    }

    if(isRateLimited) {
        return response.status(429).json({
            message : "You are being rate limited.",
            retry_after : (resp.msBeforeNext / 1000).toString(),
            global : opts.global
        })
    }

    // set the shit as a locals
}