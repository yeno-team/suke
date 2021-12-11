import { RequestHandler } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { catchErrorAsync } from "./catchErrorAsync";

export const createRateLimit = (limiter : RateLimiterRedis , key : string) : RequestHandler => catchErrorAsync(async (req , res , next) => {
    key = key + req.ip
    const response = await limiter.get(key + req.ip)

    res.set("X-RateLimit-Limit", (limiter.points).toString())

    if(response !== null && (response.consumedPoints >= limiter.points)) {
        const retrySecs = Math.floor((response.msBeforeNext / 1000) | 1)

        res.set("X-RateLimit-Remaining" , (response.remainingPoints).toString())    
        res.set("X-RateLimit-Reset" , (response.msBeforeNext).toString())
        res.set("Retry-After" , retrySecs.toString())

        return res.status(429).json({
            retry_after : retrySecs,
            message : "You are being rate limited."
        })
    }

    res.locals.rateLimiter = { limiter , key }

    next()
})