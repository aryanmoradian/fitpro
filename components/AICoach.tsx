import React, { useState, useRef, useEffect } from 'react';
import { chatWithCoach } from '../services/geminiService';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

const AICoach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'درود! من مربی هوشمند شما هستم. چطور می‌توانم در مورد تمرین یا تغذیه به شما کمک کنم؟', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Convert internal message format to Gemini history format (simplified)
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      // Add current message to context
      history.push({ role: 'user', parts: [{ text: userMsg.text }] });

      const responseText = await chatWithCoach(userMsg.text, history);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full energetic-card overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex items-start ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white/20 shadow-lg ${msg.role === 'user' ? 'bg-blue-600 mr-3' : 'bg-green-600 ml-3'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-700 text-gray-100 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="max-w-[80%] flex items-start flex-row">
              <div className="w-10 h-10 rounded-full bg-green-600 ml-3 flex items-center justify-center border-2 border-white/20">
                 <Bot size={20} />
              </div>
              <div className="bg-gray-700 p-4 rounded-2xl rounded-tl-none flex items-center">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div data-tour-id="coach-chat-input" className="p-4 bg-black/30 border-t border-white/10">
        <div className="flex items-center space-x-2 space-x-reverse">
          <input
            type="text"
            className="flex-1 input-styled px-4 py-3"
            placeholder="سوال خود را از مربی بپرسید..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-110"
          >
            <Send size={20} className="transform rotate-180" /> 
            {/* Rotated icon for RTL */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;