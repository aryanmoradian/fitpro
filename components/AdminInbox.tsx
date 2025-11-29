
import React, { useState } from 'react';
import { sendMessage } from '../services/messagingService';
import { Send, Users, User } from 'lucide-react';

const AdminInbox: React.FC = () => {
  const [target, setTarget] = useState<'broadcast' | 'single'>('broadcast');
  const [receiverId, setReceiverId] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!subject || !message) return alert("Fill all fields");
    if (target === 'single' && !receiverId) return alert("User ID required");

    await sendMessage('admin', target === 'single' ? receiverId : null, subject, message, target === 'broadcast');
    alert("Message Sent!");
    setMessage('');
    setSubject('');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Internal Messaging System</h2>
      <div className="bg-[#1E293B] p-6 rounded-xl border border-gray-700 shadow-xl">
        <div className="flex gap-4 mb-6">
          <button onClick={() => setTarget('broadcast')} className={`flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 ${target === 'broadcast' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black/20 border-gray-600 text-gray-400'}`}>
            <Users /> Broadcast All
          </button>
          <button onClick={() => setTarget('single')} className={`flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 ${target === 'single' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black/20 border-gray-600 text-gray-400'}`}>
            <User /> Single User
          </button>
        </div>

        {target === 'single' && (
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">User ID</label>
            <input className="w-full input-styled p-3" value={receiverId} onChange={e => setReceiverId(e.target.value)} placeholder="UUID..." />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Subject</label>
          <input className="w-full input-styled p-3" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Important Update..." />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">Message</label>
          <textarea className="w-full input-styled p-3 h-32" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message here..." />
        </div>

        <button onClick={handleSend} className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-lg">
          <Send size={20} /> Send Message
        </button>
      </div>
    </div>
  );
};

export default AdminInbox;
