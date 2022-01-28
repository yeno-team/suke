import { RequestHandler } from "express";
import { RateLimiterOpts } from "@suke/suke-core/src/entities/RateLimiterOpts";
import { GlobalRateLimiter } from "../limiters";
import { catchErrorAsync } from "./catchErrorAsync";
import { createRateLimiter } from "./createRateLimiter";

export const setGlobalRateLimiter = () : RequestHandler => catchErrorAsync(async (req , res , next) => {
    const opts = new RateLimiterOpts({
        key : req.ip,
        limiter : GlobalRateLimiter,
        pointsToConsume : 1,
        isGlobalLimiter : true
    })

    const { isRateLimited } = await createRateLimiter(res , opts)

    if(isRateLimited) {
        return
    }

    next()
})