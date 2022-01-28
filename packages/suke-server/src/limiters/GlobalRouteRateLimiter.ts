import { RateLimiterRedis , IRateLimiterStoreOptions } from "rate-limiter-flexible";
import { TempRedisClientForRateLimiter } from "../config";

const opts : IRateLimiterStoreOptions = {
    storeClient : TempRedisClientForRateLimiter,
    points : 60,
    duration : 60,
    blockDuration : 60 * 5,
    keyPrefix : "global_rate_limiter"
};

export default new RateLimiterRedis(opts);