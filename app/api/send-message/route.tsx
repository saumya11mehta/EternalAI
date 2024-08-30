import { NextResponse,NextRequest } from 'next/server';
import connectDB from '@/lib/db/db';
import { IMessage } from '@/lib/db/messageSchema';
import { findMessagesByChatId, saveMessage } from '@/lib/dbModelFunctions/Message';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { saveChat } from '@/lib/dbModelFunctions/Chat';
import rateLimiter from '@/lib/api/globalRateLimiter';

export interface IHistory { 
	role: string; 
	parts: { text: string; }[];
}

export async function POST(request: NextRequest) {
	try {

		// Use the rate limiter middleware
		const rateLimitResult = await rateLimiter();

		// Check if the rate limiter returned an error
		if (rateLimitResult.error) {
		  return NextResponse.json({ error: rateLimitResult.error },{ status : rateLimitResult.statusCode});
		}

		// Ensure MongoDB connection
		await connectDB();

		// Retrieve message data from request body
		let { userId, messageContent, chatId } : {userId:string, messageContent:string, chatId:string} = await request.json();

		if (chatId == null) {
			const chat = await saveChat("Chat Topic",userId);
			chatId = chat._id;
		}
		//Fetch the past messages before saving the new message to the database
		const messages: IMessage[] = await findMessagesByChatId(chatId);
		
		const newMessage = await saveMessage("user",messageContent,chatId);

		//Form chat history from past messages
		const history = getChatHistory(messages);

		const response = await getModelResponse(history,messageContent);

		if(response!=""){
			const modelResponse = await saveMessage("model",response,chatId);

			// Return a success message
			return NextResponse.json({ chatId:chatId,modelResponse: response }, { status: 201 });
		}else{
			return NextResponse.json({ error:"No response from AI ask a different question"}, { status: 201 });
		}

		
	} catch (error) {
		console.error('Failed to send message:', error);
		return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
	}
}

function getChatHistory(messages : IMessage[]){
	return messages.map(message => {
		return {
		  role: message.messageBy,
		  parts: [{ text: message.messageContent }]
		};
	});
}

async function getModelResponse(history: IHistory[], currentMessage : string){
	try {
		
		// Access your API key as an environment variable (see "Set up your API key" above)
		const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);

		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

		const chat = model.startChat({
			history: history,
			generationConfig: {
			maxOutputTokens: 1000,
			},
		});

		const msg = currentMessage;

		const result = await chat.sendMessage(msg);
		const response = await result.response;
		const text = response.text();
		return text;
	}catch (err) {
		console.error('Failed to send message:', err);
		return "";
	}

}

