import { RequestHandler } from "express";
import { GlobalRateLimiter } from "../limiters";
import { catchErrorAsync } from "./catchErrorAsync";
import { setRateLimiter  , setRateLimiterOpts } from "./createRateLimiter";

export const setGlobalRateLimiter = () : RequestHandler => async (req , res , next) => {
    const setGlobalRateLimiterOpts : setRateLimiterOpts = {
        global : true,
        limiter : GlobalRateLimiter,
        key : req.ip
    }

    await setRateLimiter(res , setGlobalRateLimiterOpts)
    next()
}