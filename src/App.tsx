import React, { useState, useEffect } from 'react';
import { Bot, Zap, Shield, Star, Music, Camera, Heart } from 'lucide-react';
import CommandButton from './components/CommandButton';
import ChatInterface from './components/ChatInterface';
import DogStatus from './components/DogStatus';
import CameraFeed from './components/CameraFeed';
import { commands } from './data/commands';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { AIService } from './services/aiService';
import { ChatMessage, Command, DogStatus as DogStatusType, HealthData, Medication, HealthReminder } from './types';
import HealthMonitor from './components/HealthMonitor';

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
    location: 'Living Room',
    cameraActive: false,
    intruderDetected: false,
    emotion: 'happy',
    nightVisionMode: false,
    learningMode: false,
    skillsLearned: ['Basic Commands', 'Movement Control'],
    conversationMode: false
  });

  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: 72,
    steps: 8543,
    bloodPressure: { systolic: 120, diastolic: 80 },
    bloodOxygen: 98,
    sleepHours: 7.5,
    stressLevel: 'low',
    lastSync: new Date(),
    deviceConnected: true,
    deviceType: 'apple_watch'
  });

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Vitamin D3',
      dosage: '1000 IU',
      frequency: 'Daily',
      nextDose: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      taken: false,
      importance: 'routine'
    },
    {
      id: '2',
      name: 'Blood Pressure Med',
      dosage: '10mg',
      frequency: 'Twice daily',
      nextDose: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      taken: false,
      importance: 'critical'
    },
    {
      id: '3',
      name: 'Omega-3',
      dosage: '1000mg',
      frequency: 'Daily',
      nextDose: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
      taken: true,
      importance: 'important'
    }
  ]);

  const [healthReminders, setHealthReminders] = useState<HealthReminder[]>([
    {
      id: '1',
      type: 'hydration',
      title: 'Drink Water',
      message: 'Time for your hourly hydration reminder!',
      scheduledTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
      completed: false,
      priority: 'medium'
    },
    {
      id: '2',
      type: 'exercise',
      title: 'Take a Walk',
      message: 'You\'ve been sitting for 2 hours. Time for a 10-minute walk!',
      scheduledTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
      completed: false,
      priority: 'high'
    },
    {
      id: '3',
      type: 'checkup',
      title: 'Doctor Appointment',
      message: 'Annual checkup with Dr. Smith tomorrow at 2 PM',
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      completed: false,
      priority: 'high'
    }
  ]);
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
        location: ['Living Room', 'Kitchen', 'Garden', 'Hallway'][Math.floor(Math.random() * 4)],
        // Randomly change emotions based on activity
        emotion: prev.currentAction === 'Patrol' ? 'alert' : 
                prev.currentAction === 'Sleep' ? 'sleepy' :
                prev.currentAction.includes('Dance') ? 'excited' :
                prev.currentAction.includes('Play') ? 'playful' : prev.emotion
      }));
      
      // Simulate health data updates
      setHealthData(prev => ({
        ...prev,
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
        steps: prev.steps + Math.floor(Math.random() * 50),
        stressLevel: prev.stressLevel === 'low' && Math.random() > 0.9 ? 'moderate' :
                    prev.stressLevel === 'moderate' && Math.random() > 0.8 ? 'low' : prev.stressLevel,
        lastSync: new Date()
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
      const result = await aiService.processCommand(content, commands, dogStatus);
      
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
      
      // Handle status updates from AI response
      if (result.statusUpdate) {
        setDogStatus(prev => ({ ...prev, ...result.statusUpdate }));
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
    patrol: Bot,
    entertainment: Music,
    security: Camera,
    health: Heart
  };

  const categoryNames = {
    basic: 'Basic Commands',
    movement: 'Movement Control',
    tricks: 'Tricks & Fun',
    advanced: 'Advanced Actions',
    patrol: 'Patrol & Security',
    entertainment: 'Entertainment',
    security: 'Camera & Security',
    health: 'Health & Wellness'
  };

  const handleCameraToggle = () => {
    setDogStatus(prev => ({ 
      ...prev, 
      cameraActive: !prev.cameraActive,
      emotion: !prev.cameraActive ? 'alert' : prev.emotion
    }));
  };

  const handleIntruderAlert = (detected: boolean) => {
    setDogStatus(prev => ({ 
      ...prev, 
      intruderDetected: detected,
      lastIntruderAlert: detected ? new Date() : prev.lastIntruderAlert,
      emotion: detected ? 'protective' : 'alert'
    }));
    
    if (detected) {
      speak("Intruder detected! Security protocol activated.");
    }
  };

  const handleMedicationTaken = (medicationId: string) => {
    setMedications(prev => prev.map(med => 
      med.id === medicationId ? { ...med, taken: true } : med
    ));
    
    const medication = medications.find(med => med.id === medicationId);
    if (medication) {
      speak(`${medication.name} marked as taken. Good job staying healthy!`);
      
      const successMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `✅ ${medication.name} taken successfully! Keep up the healthy habits!`,
        sender: 'system',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, successMessage]);
    }
  };

  const handleReminderCompleted = (reminderId: string) => {
    setHealthReminders(prev => prev.map(reminder => 
      reminder.id === reminderId ? { ...reminder, completed: true } : reminder
    ));
    
    const reminder = healthReminders.find(r => r.id === reminderId);
    if (reminder) {
      speak(`Great job completing your ${reminder.title} reminder!`);
    }
  };

  const handleSyncHealthData = () => {
    setHealthData(prev => ({ ...prev, lastSync: new Date() }));
    speak("Health data synchronized successfully!");
    
    const syncMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `🔄 Health data synced from ${healthData.deviceType.replace('_', ' ')}. All vitals updated!`,
      sender: 'system',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, syncMessage]);
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
          <div className="space-y-8">
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

          {/* Middle Column - Camera Feed */}
          <div className="space-y-8">
            <CameraFeed
              isActive={dogStatus.cameraActive}
              onToggle={handleCameraToggle}
              intruderDetected={dogStatus.intruderDetected}
              onIntruderAlert={handleIntruderAlert}
              nightVisionMode={dogStatus.nightVisionMode}
              onNightVisionToggle={() => setDogStatus(prev => ({ 
                ...prev, 
                nightVisionMode: !prev.nightVisionMode 
              }))}
            />
          </div>

          {/* Right Column - Chat & Status */}
          <div className="space-y-8">
            {/* Dog Status */}
            <DogStatus status={dogStatus} />
            
            {/* Health Monitor */}
            <HealthMonitor
              healthData={healthData}
              medications={medications}
              reminders={healthReminders}
              onMedicationTaken={handleMedicationTaken}
              onReminderCompleted={handleReminderCompleted}
              onSyncHealthData={handleSyncHealthData}
            />
            
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