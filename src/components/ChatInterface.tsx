import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isListening,
  onToggleListening
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-80">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : message.sender === 'ai'
                  ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
              {message.commandExecuted && (
                <div className="mt-2 px-2 py-1 bg-black/20 rounded text-xs">
                  Command: {message.commandExecuted}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700/50">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <button
            type="button"
            onClick={onToggleListening}
            className={`p-3 rounded-xl border transition-all duration-300 ${
              isListening
                ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/25'
                : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a command or speak..."
            className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
          />
          
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;