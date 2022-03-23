import { RateLimiterRedis , IRateLimiterStoreOptions } from "rate-limiter-flexible";
import { TempRedisClientForRateLimiter } from "../config";

const opts : IRateLimiterStoreOptions = {
    storeClient : TempRedisClientForRateLimiter,
    points : 3,
    duration : 60,
    blockDuration : 60 * 1,
    keyPrefix : "upload_file_limiter"
};

export default new RateLimiterRedis(opts);