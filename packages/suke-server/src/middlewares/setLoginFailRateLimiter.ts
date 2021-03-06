import { LoginFailRateLimiter } from "../limiters";
import { RateLimiterOpts } from "@suke/suke-core/src/entities/RateLimiterOpts";
import { catchErrorAsync } from "./catchErrorAsync";
import { handleRateLimiter } from "./handleRateLimiter";
import { RequestHandler } from "express";

export const setLoginFailRateLimiter = () : RequestHandler => catchErrorAsync(async (req,  res , next) => {
    const opts = new RateLimiterOpts({
        key : req.ip,
        limiter : LoginFailRateLimiter,
        pointsToConsume : 1,
        isGlobalLimiter : false
    });
    
    const { isRateLimited } = await handleRateLimiter(res , opts);
    
    if(isRateLimited) {
        return;
    }
    
    next();
}); 