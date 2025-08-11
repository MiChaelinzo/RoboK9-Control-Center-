import React from 'react';
import { Command } from '../types';

interface CommandButtonProps {
  command: Command;
  isExecuting: boolean;
  onExecute: (command: Command) => void;
}

const CommandButton: React.FC<CommandButtonProps> = ({ command, isExecuting, onExecute }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'from-green-500 to-emerald-600';
      case 'movement': return 'from-indigo-500 to-purple-600';
      case 'tricks': return 'from-purple-500 to-violet-600';
      case 'advanced': return 'from-red-500 to-rose-600';
      case 'patrol': return 'from-blue-500 to-cyan-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  return (
    <button
      onClick={() => onExecute(command)}
      disabled={isExecuting}
      className={`
        relative p-4 rounded-xl bg-gradient-to-br ${getCategoryColor(command.category)}
        backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-xl
        transform hover:scale-105 transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        group overflow-hidden
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex flex-col items-center space-y-2">
        <span className="text-2xl">{command.emoji}</span>
        <span className="text-sm font-semibold text-white">{command.name}</span>
        
        {isExecuting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
    </button>
  );
};

export default CommandButton;