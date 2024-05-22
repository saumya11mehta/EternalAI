import Message, { IMessage } from '@/lib/db/messageSchema';

export async function findMessagesByChatId(chatId: string){
    return await Message.find({ chatId: chatId }).sort({ timestamp: 1 });
}

export async function deleteMessagesByChatId(chatId: string){
	return await Message.find({ chatId: chatId }).deleteMany();
}

export async function saveMessage(msgBy:string,msgContent:string,chatId:string){
	// Create a new message document
	const message = new Message({
		messageBy: msgBy,
		messageContent: msgContent,
		timestamp: new Date(), // Add timestamp for the message
		chatId: chatId
	});

	// Save the new message document to the database
	await message.save();

	return message;
}