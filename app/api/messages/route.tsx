import {  NextResponse,type NextRequest } from 'next/server';
import connectDB from '@/lib/db/db';
import { IMessage } from '@/lib/db/messageSchema';
import { IChat } from '@/lib/db/chatSchema';
import { findMessagesByChatId } from '@/lib/dbModelFunctions/Message';
import { findChatById } from '@/lib/dbModelFunctions/Chat';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    try {
        // Ensure MongoDB connection
        await connectDB();

        // Retrieve messages for a specific chat
        
        const chatId = searchParams.get('chatId');

        const chat: IChat | null = await findChatById(chatId?chatId:"");
        if(chat){
            const messages: IMessage[] = await findMessagesByChatId(chat._id);
            return NextResponse.json({chatId : chat._id,messages:messages}, { status: 201 });
        }

        return NextResponse.json({ error: 'No chats found' }, { status: 500 })
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
}