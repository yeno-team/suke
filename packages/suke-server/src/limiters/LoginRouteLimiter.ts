import { RateLimiterRedis , IRateLimiterStoreOptions } from "rate-limiter-flexible";
import { RedisClient } from "../config"

const opts : IRateLimiterStoreOptions = {
    storeClient : RedisClient,
    points : 20,
    duration : 60 * 10, // 10 minutes
    keyPrefix : "login_route_rate_limiter"
}

export default new RateLimiterRedis(opts)