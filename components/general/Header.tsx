// components/Header.tsx
import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

interface HeaderProps {
  showChatHistory: boolean;
  setShowChatHistory: (show: boolean) => void;
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ showChatHistory, setShowChatHistory, handleLogout }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-r bg-black text-white">
      <button onClick={() => setShowChatHistory(!showChatHistory)} className="p-2">
        {showChatHistory ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      <button onClick={handleLogout} className="bg-red-500 p-2 rounded">
        Logout
      </button>
    </div>
  );
};

export default Header;