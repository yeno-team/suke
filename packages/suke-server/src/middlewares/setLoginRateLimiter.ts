import { RequestHandler } from "express";
import { LoginRouteRateLimiter } from "../limiters";
import { catchErrorAsync } from "./catchErrorAsync";
import { setRateLimiter  , setRateLimiterOpts } from "./createRateLimiter";

export const setLoginRateLimiter = () : RequestHandler => catchErrorAsync(async (req , res , next) => {
    const setLoginRateLimiterOpts : setRateLimiterOpts = {
        global : false,
        limiter : LoginRouteRateLimiter,
        pointsToConsume : 1,
        key : req.ip
    }

    await setRateLimiter(res , setLoginRateLimiterOpts)
    next()
})