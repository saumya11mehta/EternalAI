import { IChat } from "@/lib/db/chatSchema";
import { useEffect, useState } from "react";
import { FaPlus, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import ConfirmationDialog from "../general/ConfirmationDialog";

type ChatHistoryProps = {
	userId:string,
    updateChatId: (chatId:string|null) => void
}

const ChatHistory = ({userId,updateChatId} : ChatHistoryProps) => {
    const [chats,setChats] = useState<IChat[]>([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<string | null>(null);
    const [editChatId, setEditChatId] = useState<string | null>(null);
    const [editChatTopic, setEditChatTopic] = useState<string>("");

    useEffect(() => {
		if(userId){
			fetchChats(userId);
		}
	}, []);

    const fetchChats = async (userId : string) => {
        try {
			const response = await fetch(`/api/chats?userId=${userId}`);
			const data = await response.json();
            setChats(data.chats)
		} catch (error) {
			console.error('Error fetching messages:', error);
		}
    }

    const deleteChat = async (chatId: string) => {
        try {
            const response = await fetch(`/api/delete-chat`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatId:chatId }),
            });
            if (response.ok) {
                setChats(chats.filter(chat => chat._id !== chatId));
                console.log('Chat deleted successfully');
            } else {
                console.error('Failed to delete chat');
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
        }
    }

    const updateChatTopic = async (chatId: string, newTopic: string) => {
        try {
            const response = await fetch(`/api/update-chat`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatId:chatId, chatTopic: newTopic,userId: userId}),
            });
            if (response.ok) {
                const data = await response.json();
                setChats(data.chats);
                setEditChatId(null);
                setEditChatTopic("");
                console.log('Chat topic updated successfully');
            } else {
                console.error('Failed to update chat topic');
            }
        } catch (error) {
            console.error('Error updating chat topic:', error);
        }
    }

    const handleEditClick = (chatId: string, currentTopic: string) => {
        setEditChatId(chatId);
        setEditChatTopic(currentTopic);
    };
    
    const handleDeleteClick = (chatId: string) => {
        setChatToDelete(chatId);
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        if (chatToDelete) {
            deleteChat(chatToDelete);
        }
        setShowConfirm(false);
        setChatToDelete(null);
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setChatToDelete(null);
    };

    return (
        <div className="col-span-1  bg-gray-800 min-h-0">
            <div className="py-4 m-4 font-extrabold border-b-2 border-gray-500 ">
                Your Chat History
            </div>
            <div className="hover:bg-gray-700 rounded-2xl text-sm p-2 mt-2 mx-2 flex items-center hover:cursor-pointer" onClick={()=>{ updateChatId(null); }}>
                    <span className="flex-grow">Create New Chat </span> <div className="p-2"><FaPlus /></div>
            </div>
            {    
                chats && <div className="flex flex-col p-2 h-[calc(100%-12rem)] overflow-auto my-2 mr-1">
                    {
                        chats.map((chat, index) => (
                            <div className="hover:bg-gray-700 rounded-2xl text-sm p-2 flex items-center hover:cursor-pointer" key={index} onClick={()=>{ updateChatId(chat._id) }}>
                                {
                                    editChatId === chat._id ? (
                                        <input
                                            type="text"
                                            className="bg-gray-700 w-10 flex-grow mr-2 text-white rounded p-1"
                                            value={editChatTopic}
                                            onChange={(e) => setEditChatTopic(e.target.value)}
                                        />
                                    ) : (
                                        <span className="flex-grow">{chat.chatTopic}</span>
                                    )
                                }
                                {
                                    editChatId === chat._id ? (
                                        <>
                                            <button className="bg-green-600 rounded-full p-2 border border-gray-800 hover:bg-green-700" onClick={() => updateChatTopic(chat._id, editChatTopic)}>
                                                <FaCheck />
                                            </button>
                                            <button className="bg-red-600 rounded-full p-2 border border-gray-800 hover:bg-red-700" onClick={() => { setEditChatId(null); setEditChatTopic(""); }}>
                                                <FaTimes />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="bg-black rounded-full p-2 border border-gray-800 hover:bg-gray-700" onClick={(e) => { e.stopPropagation(); handleEditClick(chat._id, chat.chatTopic); }}>
                                                <FaPencil />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(chat._id); }} className="bg-black rounded-full p-2 border border-gray-800 hover:bg-gray-700">
                                                <FaTrashAlt />
                                            </button>
                                        </>
                                    )
                                }
                            </div>
                        ))
                    }
                </div>
            }
            {showConfirm && (
                <ConfirmationDialog
                    message="Are you sure you want to delete this chat?"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}

export default ChatHistory;