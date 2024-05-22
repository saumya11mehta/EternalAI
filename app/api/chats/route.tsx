import { IChat } from '@/lib/db/chatSchema';
import connectDB from '@/lib/db/db';
import { findChatsByUserId } from '@/lib/dbModelFunctions/Chat';
import {  NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    try {
        // Ensure MongoDB connection
        await connectDB();

        // Retrieve chats for a specific user (replace userId with the actual user ID)
        const userId = searchParams.get('userId');

        const chats: IChat[] = await findChatsByUserId(userId?userId:"");

        return NextResponse.json({ chats: chats }, { status: 201 })
    } catch (err) {
        console.error('Error fetching messages:', err);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}