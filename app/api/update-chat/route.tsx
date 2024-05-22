import connectDB from "@/lib/db/db";
import { findChatsByUserId, updateChatTopicById } from "@/lib/dbModelFunctions/Chat";
import { NextRequest,NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    const { chatId, chatTopic, userId } = await request.json();
    try {
        await connectDB();
        
        await updateChatTopicById(chatId,chatTopic);

        // Fetch all chats for the user
        const updatedChats = await findChatsByUserId(userId);

        return NextResponse.json({ chats: updatedChats },{ status:200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update chat topic' },{ status:500 });
    }
}