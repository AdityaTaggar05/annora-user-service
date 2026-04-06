import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!, {
	// Retry reconnects at a random interval between 10s and 15s, up to 5 attempts.
	retryStrategy: (times) => {
		if (times > 5) {
			return null;
		}

		return 10_000 + Math.floor(Math.random() * 5_001);
	},
	// Retry failed commands at most 5 times while reconnecting.
	maxRetriesPerRequest: 5,
})