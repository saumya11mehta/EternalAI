import connectDB from "@/lib/db/db";
import { deleteChat } from "@/lib/dbModelFunctions/Chat";
import { deleteMessagesByChatId } from "@/lib/dbModelFunctions/Message";
import { NextRequest,NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();
        const { chatId } = await request.json();

        const deletedChat = await deleteChat(chatId);

        if (!deletedChat) {
            return NextResponse.json({ error: 'Chat not found' },{status:404});
        }

        const deleteMessages = await deleteMessagesByChatId(chatId);

        return NextResponse.json({ message: 'Chat deleted successfully' },{status:200});
    } catch (error) {
        console.error('Failed to delete chat:', error);
        return NextResponse.json({ error: 'Failed to delete chat' },{status:500});
    }
}