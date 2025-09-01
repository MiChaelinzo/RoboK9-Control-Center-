import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Plus, Trash2, Play, Save, Brain, Lightbulb } from 'lucide-react';
import { VoiceCommand } from '../types';

interface VoiceCommandTrainerProps {
  onAddCustomCommand: (command: VoiceCommand) => void;
  onDeleteCommand: (commandId: string) => void;
  customCommands: VoiceCommand[];
}

const VoiceCommandTrainer: React.FC<VoiceCommandTrainerProps> = ({
  onAddCustomCommand,
  onDeleteCommand,
  customCommands
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [newCommand, setNewCommand] = useState({
    phrase: '',
    commandId: '',
    description: ''
  });
  const [recordedPhrases, setRecordedPhrases] = useState<string[]>([]);
  const [isTraining, setIsTraining] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    // In a real implementation, this would start voice recording
    setTimeout(() => {
      const mockPhrases = [
        "Hey RoboK9, time for walkies",
        "Robot dog, let's go for a walk",
        "Come on buddy, walk time"
      ];
      setRecordedPhrases(mockPhrases);
      setIsRecording(false);
    }, 3000);
  };

  const trainCommand = () => {
    if (newCommand.phrase && newCommand.commandId && recordedPhrases.length > 0) {
      setIsTraining(true);
      
      setTimeout(() => {
        const command: VoiceCommand = {
          id: `custom_${Date.now()}`,
          phrases: [newCommand.phrase, ...recordedPhrases],
          commandId: newCommand.commandId,
          confidence: 0.85
        };
        
        onAddCustomCommand(command);
        setNewCommand({ phrase: '', commandId: '', description: '' });
        setRecordedPhrases([]);
        setIsTraining(false);
      }, 2000);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="text-green-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Voice Command Trainer</h3>
        </div>
        
        <div className="text-xs text-slate-400">
          {customCommands.length} custom commands
        </div>
      </div>

      {/* Training Interface */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-slate-300 text-sm mb-2">Command Phrase</label>
          <input
            type="text"
            value={newCommand.phrase}
            onChange={(e) => setNewCommand(prev => ({ ...prev, phrase: e.target.value }))}
            placeholder="e.g., 'Time for walkies'"
            className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-slate-300 text-sm mb-2">Maps to Command</label>
          <select
            value={newCommand.commandId}
            onChange={(e) => setNewCommand(prev => ({ ...prev, commandId: e.target.value }))}
            className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
          >
            <option value="">Select a command...</option>
            <option value="move_forward">Move Forward</option>
            <option value="patrol">Start Patrol</option>
            <option value="play_music">Play Music</option>
            <option value="dance">Dance</option>
            <option value="health_check">Health Check</option>
            <option value="exercise_reminder">Exercise Reminder</option>
          </select>
        </div>

        {/* Voice Recording */}
        <div className="p-4 bg-slate-800/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 text-sm">Record Alternative Phrases</span>
            <button
              onClick={startRecording}
              disabled={isRecording}
              className={`p-2 rounded-lg transition-colors ${
                isRecording
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              }`}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          </div>
          
          {isRecording && (
            <div className="text-center py-4">
              <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse mx-auto mb-2" />
              <p className="text-red-400 text-sm">Recording... Say the command in different ways</p>
            </div>
          )}
          
          {recordedPhrases.length > 0 && (
            <div className="space-y-2">
              <p className="text-slate-300 text-sm">Recorded phrases:</p>
              {recordedPhrases.map((phrase, index) => (
                <div key={index} className="p-2 bg-slate-700/50 rounded text-sm text-slate-300">
                  "{phrase}"
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={trainCommand}
          disabled={!newCommand.phrase || !newCommand.commandId || isTraining}
          className="w-full p-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isTraining ? (
            <>
              <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
              <span>Training AI...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Train Command</span>
            </>
          )}
        </button>
      </div>

      {/* Custom Commands List */}
      <div>
        <h4 className="text-white font-medium mb-3">Custom Commands</h4>
        
        {customCommands.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {customCommands.map(command => (
              <div key={command.id} className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">"{command.phrases[0]}"</div>
                    <div className="text-slate-400 text-sm">→ {command.commandId}</div>
                    <div className="text-slate-500 text-xs">
                      Confidence: {Math.round(command.confidence * 100)}%
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        // Test the command
                        const utterance = new SpeechSynthesisUtterance(`Testing command: ${command.phrases[0]}`);
                        speechSynthesis.speak(utterance);
                      }}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                      title="Test Command"
                    >
                      <Play size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteCommand(command.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                      title="Delete Command"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Plus className="mx-auto mb-2 text-slate-400" size={32} />
            <p className="text-slate-400">No custom commands yet</p>
            <p className="text-slate-500 text-sm">Train RoboK9 to understand your unique phrases</p>
          </div>
        )}
      </div>

      {/* Training Tips */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className="text-blue-400" size={16} />
          <span className="text-blue-400 font-semibold">Training Tips</span>
        </div>
        <div className="space-y-1 text-sm text-blue-300">
          <div>• Speak clearly and at normal pace</div>
          <div>• Record 3-5 different ways to say the same command</div>
          <div>• Use natural language, not robotic phrases</div>
          <div>• Test commands after training to verify accuracy</div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCommandTrainer;