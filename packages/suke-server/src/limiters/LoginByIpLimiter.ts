import { RateLimiterRedis , IRateLimiterStoreOptions } from "rate-limiter-flexible";
import { RedisClient } from "../config/index"

const opts : IRateLimiterStoreOptions = {
    storeClient : RedisClient,
    keyPrefix : "login_fail_by_ip_per_day:",
    duration : 60 * 60 * 24,
    points : 20,
    blockDuration : 60 * 60 * 24
}

const limiter = new RateLimiterRedis(opts)

export default {
    limiter,
    opts
}