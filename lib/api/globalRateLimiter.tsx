import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/db';
import RateLimit from '@/lib/db/rateLimitSchema';

const RATE_LIMIT_PER_MINUTE = 14;
const RATE_LIMIT_PER_DAY = 1400;

const rateLimiter = async () => {
	await connectDB();

	const minuteKey = 'global_rate_limit:minute';
	const dayKey = 'global_rate_limit:day';

	const now = new Date();

	try {
		// Handle minute rate limit
		let minuteLimit = await RateLimit.findOne({ key: minuteKey });

		if (!minuteLimit) {
			minuteLimit = new RateLimit({
				key: minuteKey,
				count: 1,
				expiresAt: new Date(now.getTime() + 60000), // 1 minute
			});
		} else {
			if (minuteLimit.expiresAt < now) {
				minuteLimit.count = 1;
				minuteLimit.expiresAt = new Date(now.getTime() + 60000);
			} else {
				minuteLimit.count += 1;
			}
		}

		if (minuteLimit.count > RATE_LIMIT_PER_MINUTE) {
			return { error: 'Server Busy, please try again after a minute', statusCode: 429 };
		}

		await minuteLimit.save();

		// Handle day rate limit
		let dayLimit = await RateLimit.findOne({ key: dayKey });

		if (!dayLimit) {
			dayLimit = new RateLimit({
				key: dayKey,
				count: 1,
				expiresAt: new Date(now.getTime() + 86400000), // 1 day
			});
		} else {
			if (dayLimit.expiresAt < now) {
				dayLimit.count = 1;
				dayLimit.expiresAt = new Date(now.getTime() + 86400000);
			} else {
				dayLimit.count += 1;
			}
		}

		if (dayLimit.count > RATE_LIMIT_PER_DAY) {
			return { error: 'Server Down for the day, try again tomorrow', statusCode: 429 };
		}

		await dayLimit.save();

		return { success: true };
	} catch (error) {
		console.error('Rate limiter error:', error);
		return { error: 'Internal server error', statusCode: 500 };
	}
};

export default rateLimiter;