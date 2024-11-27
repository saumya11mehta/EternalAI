import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_PER_MINUTE = 14;
const RATE_LIMIT_PER_DAY = 1400;
const MINUTE_ERROR_MESSAGE = "Server Busy, please try again after a minute";
const DAY_ERROR_MESSAGE = "Server Down for the day, try again tomorrow";

// In-memory storage for rate limiting
let minuteCount = 0;
let dayCount = 0;
let lastMinuteReset = Date.now();
let lastDayReset = Date.now();

const rateLimiter = async () => {
    const now = Date.now();

    // Reset counters if the time window has passed
    if (now - lastMinuteReset > 60000) {
        minuteCount = 0;
        lastMinuteReset = now;
    }

    if (now - lastDayReset > 86400000) {
        dayCount = 0;
        lastDayReset = now;
    }

    // Increment counters
    minuteCount += 1;
    dayCount += 1;

    if (minuteCount > RATE_LIMIT_PER_MINUTE) {
        return { error: MINUTE_ERROR_MESSAGE, statusCode: 429 };
    }

    if (dayCount > RATE_LIMIT_PER_DAY) {
        return { error: DAY_ERROR_MESSAGE, statusCode: 429 };
    }

    return { success: true };
};

// Example usage in your API route:
export async function middleware(request: NextRequest) {
    const result = await rateLimiter();
    
    if (result.error) {
        return NextResponse.json(
            { error: result.error },
            { status: result.statusCode }
        );
    }
    
    return NextResponse.next();
}

export default rateLimiter;