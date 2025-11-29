
import React, { useState, useEffect } from 'react';
import { getUserMessages, markAsRead } from '../services/messagingService';
import { Message, UserProfile } from '../types';
import { Mail, MailOpen } from 'lucide-react';

const UserInbox: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if(profile.id) {
        getUserMessages(profile.id).then(setMessages);
    }
  }, [profile.id]);

  const handleRead = (msg: Message) => {
    if(!msg.isRead) {
        markAsRead(msg.id);
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Mail className="text-yellow-400"/> Messages</h2>
      <div className="space-y-4">
        {messages.length === 0 && <p className="text-gray-500">No messages.</p>}
        {messages.map(msg => (
          <div key={msg.id} onClick={() => handleRead(msg)} className={`p-4 rounded-xl border cursor-pointer transition ${msg.isRead ? 'bg-black/20 border-gray-800' : 'bg-blue-900/20 border-blue-500/50'}`}>
            <div className="flex justify-between items-start mb-2">
                <h4 className={`font-bold ${msg.isRead ? 'text-gray-300' : 'text-white'}`}>{msg.subject}</h4>
                <span className="text-xs text-gray-500">{msg.createdAt}</span>
            </div>
            <p className="text-sm text-gray-400">{msg.message}</p>
            {msg.isBroadcast && <span className="mt-2 inline-block text-[10px] bg-yellow-900/50 text-yellow-500 px-2 py-0.5 rounded">Broadcast</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserInbox;
