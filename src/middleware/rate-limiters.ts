import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from "../configs/redis";

export const ipRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "rl_ip_users",
    points: 5,
    duration: 60
})

export const userRateLimiter = new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "rl_user_users",
    points: 3,
    duration: 60
})