import { RateLimiterOpts } from "@suke/suke-core/src/entities/RateLimiterOpts";
import { catchErrorAsync } from "./catchErrorAsync";
import { handleRateLimiter } from "./handleRateLimiter";
import { RequestHandler } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";

export const createRateLimiter = (limiter: RateLimiterRedis) : RequestHandler => catchErrorAsync(async (req,  res , next) => {
    const opts = new RateLimiterOpts({
        key : req.ip,
        limiter,
        pointsToConsume : 1,
        isGlobalLimiter : false
    });
    
    const { isRateLimited } = await handleRateLimiter(res , opts);
    
    if(isRateLimited) {
        return;
    }
    
    next();
}); 