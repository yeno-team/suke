import { RequestHandler } from "express";
import { RateLimiterOpts } from "@suke/suke-core/src/entities/RateLimiterOpts";
import { GlobalRateLimiter } from "../limiters";
import { catchErrorAsync } from "./catchErrorAsync";
import { handleRateLimiter } from "./handleRateLimiter";
import { Role } from "@suke/suke-core/src/Role";

export const setGlobalRateLimiter = () : RequestHandler => catchErrorAsync(async (req , res , next) => {
    if (req.session.user != null && req.session.user.role === Role.Admin) return next();
    const opts = new RateLimiterOpts({
        key : req.ip,
        limiter : GlobalRateLimiter,
        pointsToConsume : 1,
        isGlobalLimiter : true
    });

    const { isRateLimited } = await handleRateLimiter(res , opts);

    if(isRateLimited) {
        return;
    }

    next();
});