import { RequestHandler } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { catchErrorAsync } from "./catchErrorAsync";

export const isUserRateLimited = (limiter : RateLimiterRedis , key : string) : RequestHandler => catchErrorAsync(async (req , res , next) => {
    const rateLimiterResp = await limiter.get(key + req.ip)
    
    res.set("RateLimit-Limit", (limiter.points).toString())

    if(rateLimiterResp !== null && (rateLimiterResp.consumedPoints > limiter.points)) {
        const retrySecs = Math.floor((rateLimiterResp.msBeforeNext / 1000) | 1)

        res.set("RateLimit-Remaining" , "0")    
        res.set("RateLimit-Reset" , retrySecs.toString())

        return res.status(429).json({
            success : false,
            text : "Too Many Requests!"
        })
    }

    res.locals.rateLimiterResp = rateLimiterResp
    res.locals.rateLimiter = limiter

    next()
})