import Logo from '@/image/logo/Logo';
import { useState, useEffect, useRef } from 'react';
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
	const [isMobile, setIsMobile] = useState(false);
	const [showChatHistory, setShowChatHistory] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.innerWidth <= 768;
			setIsMobile(mobile);
			if(mobile){
				setShowChatHistory(false);
			}
		};
		
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	useEffect(() => {
		if(chatId){
			fetchMessages(chatId);
		}else{
			setMessages([]);
		}
	}, [chatId]);

	useEffect(() => {
		if (messages.length > 0) {
			bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	const updateChatId = (chatId: string|null) => {
		setChatId(chatId);
	}

	const fetchMessages = async (chatId : string) => {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/messages?chatId=${chatId}`);
			if (!response.ok) {
				throw new Error('Failed to fetch messages');
			}
			const data = await response.json();
			if (data?.chatId && Array.isArray(data?.messages)) {
				setChatId(data.chatId);
				setMessages(data.messages);
			}
		} catch (error) {
			console.error('Error fetching messages:', error);
			toast('Failed to load messages');
		} finally {
			setIsLoading(false);
		}
	};

	const sendMessage = async (chatId:string|null) => {
		const trimmedInput = inputValue.trim();
		if (!trimmedInput || trimmedInput.length > 2000) return;
		
		const userMessage:ChatMessage = { 
			messageBy: "user", 
			messageContent: trimmedInput, 
			timestamp: new Date(),
			chatId: chatId ?? ""
		};

		setMessages(prevMessages => [...prevMessages, userMessage]);
		setInputValue('');
		setIsLoading(true);

		try {
			const response = await fetch('/api/send-message', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ 
					userId, 
					messageContent: userMessage.messageContent, 
					chatId 
				}),
			});

			const reply = await response.json();

			if (!response.ok) {
				throw new Error(reply.error || 'Failed to send message');
			}

			if (reply.error) {
				toast(reply.error);
				return;
			}

			if (reply.modelResponse) {
				const modelMessage:ChatMessage = { 
					messageBy: "model", 
					messageContent: reply.modelResponse, 
					timestamp: new Date(),
					chatId: reply.chatId ?? ""
				};

				if (chatId === null) {
					setHistoryKey(prev => prev + 1);
				}
				
				setChatId(reply.chatId);
				setMessages(prevMessages => [...prevMessages, modelMessage]);
			}
		} catch (error) {
			console.error("Error Sending Message:", error);
			toast("Response Timed Out. Maybe try a different question?");
			setMessages(prevMessages => prevMessages.slice(0, -1));
		} finally {
			setIsLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('userId');
		toast('Logged out');
		router.push('/login');
	};

	return (
		<>
			<Header 
				showChatHistory={showChatHistory} 
				setShowChatHistory={setShowChatHistory} 
				handleLogout={handleLogout} 
			/>
			<div className="flex flex-col h-[calc(100vh-10vh)]">
				<div className="flex-grow flex-wrap grid max-sm:grid-flow-row sm:grid-flow-col lg:grid-cols-6 min-h-0 m-4">
					{showChatHistory && (
						<ChatHistory 
							key={historyKey} 
							userId={userId} 
							updateChatId={updateChatId}
						/>
					)}
					<div className={(showChatHistory ? " max-sm:hidden lg:col-span-5" : "lg:col-span-6") + " flex flex-col h-full basis-0 justify-end px-6 py-8 space-y-4 overflow-auto"}>
						{messages.length > 0 ? (
							<div className='h-full'>
								{messages.map((message, index) => (
									<div key={index} className={`flex ${message.messageBy === "model" ? "justify-start" : "justify-end"}`}>
										<div className={`${message.messageBy === "model" ? "bg-purple-400" : "bg-gray-700"} text-white rounded-lg [&>p]:text-wrap px-4 py-2 max-w-lg sm:w-full ${index > 0 ? " mt-3" : ""}`}>
											<MarkdownView
												markdown={message.messageContent}
												options={{ tables: true, emoji: true }}
											/>
										</div>
									</div>
								))}
								<div className="h-0 w-0" ref={bottomRef} />
							</div>
						) : (
							<EmptyChat />
						)}
					</div>
				</div>
				<div className={(showChatHistory ? " max-sm:hidden" : "") + " flex p-4 justify-center"}>
					<div className="flex sm:w-full lg:basis-1/2">
						<div className="w-full grid grid-cols-4 auto-rows-fr justify-center items-center rounded-3xl p-1 bg-gradient-to-r from-violet-600 to-purple-500 mb-2">
							<textarea
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								placeholder={`Type a message...`}
								rows={3}
								disabled={isLoading}
								className="col-span-3 rounded-l-[calc(1.5rem-0.25rem)] bg-black p-2 focus:outline-none w-full resize-none"
							/>
							<div className="flex rounded-r-[calc(1.5rem-0.25rem)] justify-end items-center bg-black rounded rounded-l-none border-0 px-4 font-bold h-full">
								<button 
									onClick={() => sendMessage(chatId)} 
									disabled={isLoading || !inputValue.trim()}
									className={`bg-purple-500 rounded-3xl text-white p-2 flex justify-center items-center ${isLoading ? 'opacity-50' : ''}`}
								>
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