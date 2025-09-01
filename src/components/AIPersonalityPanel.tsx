import React, { useState, useEffect } from 'react';
import { Brain, Heart, Zap, Star, MessageCircle, Lightbulb, Award, Clock } from 'lucide-react';
import { AIPersonality } from '../types';

interface AIPersonalityPanelProps {
  personality: AIPersonality;
  onPersonalityUpdate: (update: Partial<AIPersonality>) => void;
}

const AIPersonalityPanel: React.FC<AIPersonalityPanelProps> = ({
  personality,
  onPersonalityUpdate
}) => {
  const [showMemories, setShowMemories] = useState(false);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'cheerful': return 'text-yellow-400 bg-yellow-500/20';
      case 'serious': return 'text-blue-400 bg-blue-500/20';
      case 'playful': return 'text-green-400 bg-green-500/20';
      case 'protective': return 'text-red-400 bg-red-500/20';
      case 'sleepy': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'cheerful': return '😊';
      case 'serious': return '🤔';
      case 'playful': return '😄';
      case 'protective': return '🛡️';
      case 'sleepy': return '😴';
      default: return '🤖';
    }
  };

  const getStatColor = (value: number) => {
    if (value >= 80) return 'text-green-400';
    if (value >= 60) return 'text-yellow-400';
    if (value >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const changeMood = (newMood: AIPersonality['mood']) => {
    onPersonalityUpdate({ mood: newMood });
  };

  const addMemory = (memory: string) => {
    const updatedMemories = [...personality.memoryBank, memory].slice(-20); // Keep last 20 memories
    onPersonalityUpdate({ memoryBank: updatedMemories });
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="text-purple-400" size={20} />
          <h3 className="text-lg font-semibold text-white">AI Personality</h3>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMoodColor(personality.mood)}`}>
          {getMoodEmoji(personality.mood)} {personality.mood}
        </div>
      </div>

      {/* Personality Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-full mb-2 mx-auto">
            <Heart className="text-red-400" size={20} />
          </div>
          <div className={`text-lg font-semibold ${getStatColor(personality.loyalty)}`}>
            {personality.loyalty}%
          </div>
          <div className="text-xs text-slate-400">Loyalty</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-full mb-2 mx-auto">
            <Zap className="text-yellow-400" size={20} />
          </div>
          <div className={`text-lg font-semibold ${getStatColor(personality.energy)}`}>
            {personality.energy}%
          </div>
          <div className="text-xs text-slate-400">Energy</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mb-2 mx-auto">
            <Lightbulb className="text-blue-400" size={20} />
          </div>
          <div className={`text-lg font-semibold ${getStatColor(personality.intelligence)}`}>
            {personality.intelligence}%
          </div>
          <div className="text-xs text-slate-400">Intelligence</div>
        </div>
      </div>

      {/* Mood Selection */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Mood Settings</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { mood: 'cheerful', emoji: '😊', label: 'Cheerful' },
            { mood: 'serious', emoji: '🤔', label: 'Serious' },
            { mood: 'playful', emoji: '😄', label: 'Playful' },
            { mood: 'protective', emoji: '🛡️', label: 'Protective' },
            { mood: 'sleepy', emoji: '😴', label: 'Sleepy' }
          ].map(({ mood, emoji, label }) => (
            <button
              key={mood}
              onClick={() => changeMood(mood as AIPersonality['mood'])}
              className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                personality.mood === mood
                  ? getMoodColor(mood)
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {emoji} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Favorite Commands */}
      <div className="mb-6">
        <h4 className="text-white font-medium mb-3">Favorite Commands</h4>
        <div className="flex flex-wrap gap-2">
          {personality.favoriteCommands.map((command, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs"
            >
              {command}
            </span>
          ))}
        </div>
      </div>

      {/* Memory Bank */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white font-medium">Memory Bank</h4>
          <button
            onClick={() => setShowMemories(!showMemories)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {showMemories ? '−' : '+'}
          </button>
        </div>
        
        {showMemories && (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {personality.memoryBank.length > 0 ? (
              personality.memoryBank.slice(-5).map((memory, index) => (
                <div key={index} className="p-2 bg-slate-800/50 rounded text-sm text-slate-300">
                  {memory}
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <MessageCircle className="mx-auto mb-2 text-slate-400" size={24} />
                <p className="text-slate-400 text-sm">No memories stored yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Last Interaction */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
          <Clock size={12} />
          <span>Last interaction: {personality.lastInteraction.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default AIPersonalityPanel;