import React, { useState, useEffect } from 'react';
import { Bot, Zap, Shield, Star } from 'lucide-react';
import CommandButton from './components/CommandButton';
import ChatInterface from './components/ChatInterface';
import DogStatus from './components/DogStatus';
import { commands } from './data/commands';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { AIService } from './services/aiService';
import { ChatMessage, Command, DogStatus as DogStatusType } from './types';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'RoboK9 AI Assistant online. Ready for voice or text commands.',
      sender: 'system',
      timestamp: new Date()
    }
  ]);
  
  const [executingCommands, setExecutingCommands] = useState<Set<string>>(new Set());
  
  const [dogStatus, setDogStatus] = useState<DogStatusType>({
    online: true,
    battery: 87,
    currentAction: 'Idle',
    location: 'Living Room'
  });

  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();
  const aiService = AIService.getInstance();

  // Handle speech recognition results
  useEffect(() => {
    if (transcript) {
      handleSendMessage(transcript);
      resetTranscript();
    }
  }, [transcript]);

  // Simulate battery drain and status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDogStatus(prev => ({
        ...prev,
        battery: Math.max(0, prev.battery - Math.random() * 0.5),
        location: ['Living Room', 'Kitchen', 'Garden', 'Hallway'][Math.floor(Math.random() * 4)]
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const result = await aiService.processCommand(content, commands);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: result.response,
        sender: 'ai',
        timestamp: new Date(),
        commandExecuted: result.commandToExecute?.name
      };

      setMessages(prev => [...prev, aiMessage]);
      speak(result.response);

      if (result.commandToExecute) {
        await executeCommand(result.commandToExecute);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error processing your command.',
        sender: 'system',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const executeCommand = async (command: Command) => {
    setExecutingCommands(prev => new Set([...prev, command.id]));
    setDogStatus(prev => ({ ...prev, currentAction: command.name }));

    try {
      const success = await aiService.executeCommand(command);
      
      if (success) {
        const successMessage: ChatMessage = {
          id: Date.now().toString(),
          content: `${command.name} command completed successfully!`,
          sender: 'system',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
      }
    } catch (error) {
      console.error('Command execution error:', error);
    } finally {
      setExecutingCommands(prev => {
        const newSet = new Set(prev);
        newSet.delete(command.id);
        return newSet;
      });
      
      setTimeout(() => {
        setDogStatus(prev => ({ ...prev, currentAction: 'Idle' }));
      }, 2000);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const groupedCommands = commands.reduce((groups, command) => {
    if (!groups[command.category]) {
      groups[command.category] = [];
    }
    groups[command.category].push(command);
    return groups;
  }, {} as Record<string, Command[]>);

  const categoryIcons = {
    basic: Shield,
    movement: Bot,
    tricks: Star,
    advanced: Zap,
    patrol: Bot
  };

  const categoryNames = {
    basic: 'Basic Commands',
    movement: 'Movement Control',
    tricks: 'Tricks & Fun',
    advanced: 'Advanced Actions',
    patrol: 'Patrol & Security'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-2xl shadow-cyan-500/25 mb-6">
            <Bot size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            RoboK9 Control Center
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Advanced AI-powered robotic dog control system with voice recognition and intelligent command processing
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Commands */}
          <div className="lg:col-span-2 space-y-8">
            {Object.entries(groupedCommands).map(([category, categoryCommands]) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <div key={category} className="bg-slate-900/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
                  <div className="flex items-center mb-6">
                    <IconComponent className="mr-3 text-cyan-400" size={24} />
                    <h2 className="text-xl font-semibold text-white">
                      {categoryNames[category as keyof typeof categoryNames]}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoryCommands.map((command) => (
                      <CommandButton
                        key={command.id}
                        command={command}
                        isExecuting={executingCommands.has(command.id)}
                        onExecute={executeCommand}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column - Chat & Status */}
          <div className="space-y-8">
            {/* Dog Status */}
            <DogStatus status={dogStatus} />
            
            {/* Chat Interface */}
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isListening={isListening}
              onToggleListening={toggleListening}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-slate-500 text-sm">
            <Bot size={16} />
            <span>Powered by Advanced AI • RoboK9 v2.1</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;