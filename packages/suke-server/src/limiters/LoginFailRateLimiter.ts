import { RateLimiterRedis , IRateLimiterStoreOptions } from "rate-limiter-flexible";
import { TempRedisClientForRateLimiter } from "../config";

const opts : IRateLimiterStoreOptions = {
    storeClient : TempRedisClientForRateLimiter,
    points : 15,
    duration : 60 * 60,
    blockDuration : 60 * 60,
    keyPrefix : "login_fail_consecutive_user_and_ip"
};

export default new RateLimiterRedis(opts);