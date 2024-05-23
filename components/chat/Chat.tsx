import Logo from '@/image/logo/Logo';
import { useState, useEffect } from 'react';
import MarkdownView from 'react-showdown';
import ChatHistory from '@/components/chat_history/ChatHistory';
import EmptyChat from '@/components/chat/EmptyChat';
import { toast } from 'react-toastify';
import Header from '@/components/general/Header';
import { useRouter } from 'next/navigation';

type ChatProps = {
	userId:string
}

type ChatMessage = { 
	messageBy: string, 
	messageContent: string,
	timestamp: Date,
	chatId:string
}

const Chat = ({userId} : ChatProps) => {
	const router = useRouter();
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [chatId, setChatId] = useState<string | null>(null);
	const [historyKey, setHistoryKey] = useState<number>(1);
	const [showChatHistory, setShowChatHistory] = useState(true);

	useEffect(() => {
		if(chatId){
			fetchMessages(chatId);
		}else{
			setMessages([]);
		}
	}, [chatId]);

	const updateChatId = (chatId: string|null) => {
		setChatId(chatId);
	}

	const fetchMessages = async (chatId : string) => {
		try {
			const response = await fetch(`/api/messages?chatId=${chatId}`);
			const data = await response.json();
			setChatId(data.chatId);
			setMessages(data.messages);
		} catch (error) {
			console.error('Error fetching messages:', error);
		}
	};

	const sendMessage = async () => {
		if (!inputValue.trim()) return;
		const userMessage:ChatMessage = { messageBy: "user", messageContent: inputValue, timestamp: new Date(),chatId:chatId?chatId:""}; // Create message object
		setMessages([...messages, userMessage]); // Update UI with sent message
		if(chatId==null){
			setHistoryKey(historyKey+1);
		}
		setInputValue('');
		try {
			const response = await fetch('/api/send-message', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId:userId, messageContent: userMessage.messageContent, chatId: chatId}),
			});
			const reply = await response.json();
			if(reply.error){
				toast(reply.error);
			}
			if (response.ok) {
				if(reply.modelResponse){
					const modelResponse = await reply.modelResponse as string;
					const modelMessage:ChatMessage = { messageBy: "model", messageContent: modelResponse, timestamp: new Date(),chatId:chatId?chatId:""};
					setChatId(reply.chatId);
					setMessages([...messages,userMessage, modelMessage]); // Update UI with sent message
				}
			} else {
				console.error('Failed to get reponse');
			}
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	const handleLogout = () => {
		// Implement logout functionality
		
		localStorage.removeItem('userId');
		toast('Logged out');
		router.push('/login')
	  };

	return (
		<>
			<Header showChatHistory={showChatHistory} setShowChatHistory={setShowChatHistory} handleLogout={handleLogout} />
			<div className="flex flex-col h-[calc(100vh-10vh)]">
				<div className="flex-grow flex-wrap grid grid-cols-6 min-h-0 m-4">
					{ showChatHistory && <ChatHistory key={historyKey} userId={userId} updateChatId={updateChatId}/>}
					<div className={(showChatHistory?"col-span-5":"col-span-6") +" flex flex-col h-full basis-0 justify-end px-6 py-8 space-y-4 overflow-auto"}>
						{
							messages.length>0 && <div className='h-full'>
								{
									messages.map((message, index) => (
										<div key={index} className={`flex ${message.messageBy === "model"? "justify-start":"justify-end"}`}>
											<div className={`${message.messageBy === "model"? "bg-purple-400":"bg-gray-700"} text-white rounded-lg px-4 py-2 max-w-lg sm:w-full`}>
												<MarkdownView
												markdown={message.messageContent}
												options={{ tables: true, emoji: true }}
												/>
											</div>
										</div>
									))
								}
							</div>
						}
						{
							messages.length==0 && <EmptyChat/>
						}
					</div>
				</div>
				<div className="flex p-4 justify-center">
					<div className="flex sm:w-full lg:basis-1/2">
						<div className="w-full grid grid-cols-4 auto-rows-fr justify-center items-center rounded-3xl p-1 bg-gradient-to-r from-violet-600 to-purple-500 mb-2">
							<textarea
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							placeholder={`Type a message...`}
							rows={3}
							className="col-span-3 rounded-l-[calc(1.5rem-0.25rem)] bg-black p-2 focus:outline-none w-full resize-none"
							/>
							<div className="flex rounded-r-[calc(1.5rem-0.25rem)] justify-end items-center bg-black rounded rounded-l-none border-0 px-4 font-bold h-full">
								<button onClick={sendMessage} className="bg-purple-500 rounded-3xl text-white p-2 flex justify-center items-center">
									<Logo width="35" height="35"/>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Chat;