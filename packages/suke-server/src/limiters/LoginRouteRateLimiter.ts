import { RateLimiterRedis , IRateLimiterStoreOptions } from "rate-limiter-flexible";
import { RedisClient } from "../config/index"

const limiterOpts : IRateLimiterStoreOptions = {
    storeClient : RedisClient,
    keyPrefix : "login_fail_by_ip_per_day",
    duration : 60 * 60 * 24,
    points : 100,
    blockDuration : 60 * 60 * 24
}

export default new RateLimiterRedis(limiterOpts)