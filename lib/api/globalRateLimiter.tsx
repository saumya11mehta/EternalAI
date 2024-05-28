import { NextRequest, NextResponse } from 'next/server';
import Redis from 'ioredis';

const RATE_LIMIT_PER_MINUTE = 14;
const RATE_LIMIT_PER_DAY = 1400;
const MINUTE_ERROR_MESSAGE ="Server Busy, please try again after a minute"
const DAY_ERROR_MESSAGE ="Server Down for the day, try again tomorrow"
const redis = new Redis({
	host: process.env.REDIS_HOST, // Use environment variables for configuration
	port: parseInt(process.env.REDIS_PORT || '6379'),
	password: process.env.REDIS_PASSWORD, // If your Redis instance requires a password
});

const rateLimiter = async () => {
    const minuteKey = 'global_rate_limit:minute';
    const dayKey = 'global_rate_limit:day';

    try {
        const now = new Date();

        // Increment the count for the minute window and set expiry to 1 minute
		const currentMinuteCount = await redis.incr(minuteKey);
		if (currentMinuteCount === 1) {
			await redis.expire(minuteKey, 60);
		}

		// Increment the count for the day window and set expiry to 24 hours
		const currentDayCount = await redis.incr(dayKey);
		if (currentDayCount === 1) {
			await redis.expire(dayKey, 86400);
		}

        if (currentMinuteCount > RATE_LIMIT_PER_MINUTE) {
            return { error: MINUTE_ERROR_MESSAGE, statusCode: 429 };
        }

        if (currentDayCount > RATE_LIMIT_PER_DAY) {
            return { error: DAY_ERROR_MESSAGE, statusCode: 429 };
        }

        return { success: true };
    } catch (error) {
        console.error('Rate limiter error:', error);
        return { error: 'Internal server error', statusCode: 500 };
    }
};

export default rateLimiter;