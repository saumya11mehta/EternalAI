import Chat, { IChat } from '@/lib/db/chatSchema';

export async function findChatById(chatId: string){
    return await Chat.findById(chatId).sort({timestamp: "desc"});
}

export async function findChatsByUserId(userId: string){
    return await Chat.find({userId : userId}).sort({timestamp: "desc"});
}

export async function updateChatTopicById(chatId: string,chatTopic: string){
    return await Chat.updateOne({ _id: chatId }, { $set: { chatTopic:chatTopic } })
}

export async function deleteChat(chatId: string){
    return await Chat.findByIdAndDelete(chatId);
}

export async function saveChat(topic:string,userId:string){
    const chat = new Chat({
        chatTopic: topic,
        userId: userId,
        timestamp: new Date()
    })
    await chat.save();
    return chat;
}