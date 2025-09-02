import React, { useState, useEffect } from 'react';
import { Bot, Zap, Shield, Star, Music, Camera, Heart } from 'lucide-react';
import CommandButton from './components/CommandButton';
import ChatInterface from './components/ChatInterface';
import DogStatus from './components/DogStatus';
import CameraFeed from './components/CameraFeed';
import WeatherWidget from './components/WeatherWidget';
import SecurityCenter from './components/SecurityCenter';
import AIPersonalityPanel from './components/AIPersonalityPanel';
import VoiceCommandTrainer from './components/VoiceCommandTrainer';
import NotificationCenter from './components/NotificationCenter';
import ErrorBoundary from './components/ErrorBoundary';
import { commands } from './data/commands';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { AIService } from './services/aiService';
import { ChatMessage, Command, DogStatus as DogStatusType, HealthData, Medication, HealthReminder, HealthAnomaly, EmergencyContact, FitnessGoals, WeeklyActivity, WorkoutPlan, AIPersonality, VoiceCommand, SecurityEvent, WeatherData, PredictiveInsight, NutritionData, EnvironmentalData, ClinicalValidation as ClinicalValidationType, HealthcareProvider } from './types';
import HealthMonitor from './components/HealthMonitor';
import AnomalyDetector from './components/AnomalyDetector';
import FitnessCoach from './components/FitnessCoach';
import NutritionTracker from './components/NutritionTracker';
import EnvironmentalMonitor from './components/EnvironmentalMonitor';
import PredictiveInsights from './components/PredictiveInsights';
import ClinicalValidation from './components/ClinicalValidation';
import { AnomalyDetectionService } from './services/anomalyDetectionService';
import { HealthKitService } from './services/healthKitService';
import { PredictiveAnalyticsService } from './services/predictiveAnalyticsService';

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

  const [aiPersonality, setAiPersonality] = useState<AIPersonality>({
    mood: 'cheerful',
    energy: 85,
    loyalty: 95,
    intelligence: 88,
    lastInteraction: new Date(),
    favoriteCommands: ['sit', 'play_music', 'health_check'],
    memoryBank: [
      'User likes morning health checks',
      'Prefers calm music in the evening',
      'Often asks about patrol status'
    ]
  });

  const [customVoiceCommands, setCustomVoiceCommands] = useState<VoiceCommand[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: '1',
      type: 'health',
      title: 'Health Check Complete',
      message: 'All vitals are within normal ranges',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false
    },
    {
      id: '2',
      type: 'security',
      title: 'Patrol Complete',
      message: 'Perimeter scan completed - all clear',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false
    }
  ]);

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

  const [healthAnomalies, setHealthAnomalies] = useState<HealthAnomaly[]>([]);
  
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      relationship: 'doctor',
      phone: '+1-555-0123',
      email: 'dr.johnson@healthcenter.com',
      priority: 1,
      autoNotify: true
    },
    {
      id: '2',
      name: 'John Smith (Son)',
      relationship: 'family',
      phone: '+1-555-0456',
      email: 'john.smith@email.com',
      priority: 2,
      autoNotify: true
    },
    {
      id: '3',
      name: 'Mary Wilson (Caregiver)',
      relationship: 'caregiver',
      phone: '+1-555-0789',
      priority: 3,
      autoNotify: false
    }
  ]);

  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoals>({
    dailySteps: 10000,
    weeklyExerciseMinutes: 150,
    targetHeartRate: { min: 120, max: 160 },
    caloriesBurnGoal: 2000,
    activeGoals: ['Lose 5 pounds', 'Walk 10k steps daily', 'Exercise 3x per week']
  });

  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity>({
    totalSteps: 45230,
    totalExerciseMinutes: 120,
    averageHeartRate: 75,
    caloriesBurned: 1650,
    workoutsCompleted: 3,
    restDays: 2,
    progressPercentage: 78
  });

  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([
    {
      id: '1',
      name: 'Morning Cardio',
      type: 'cardio',
      duration: 20,
      difficulty: 'beginner',
      exercises: [
        {
          name: 'Warm-up Walk',
          duration: 300,
          restTime: 0,
          instructions: ['Walk at a comfortable pace', 'Focus on breathing'],
          targetMuscles: ['legs', 'cardiovascular']
        },
        {
          name: 'Light Jogging',
          duration: 600,
          restTime: 60,
          instructions: ['Jog at moderate pace', 'Keep heart rate in target zone'],
          targetMuscles: ['legs', 'cardiovascular']
        },
        {
          name: 'Cool Down',
          duration: 300,
          restTime: 0,
          instructions: ['Slow walk', 'Deep breathing exercises'],
          targetMuscles: ['full body']
        }
      ],
      targetHeartRate: { min: 120, max: 140 },
      caloriesBurn: 200
    },
    {
      id: '2',
      name: 'Strength Training',
      type: 'strength',
      duration: 30,
      difficulty: 'intermediate',
      exercises: [
        {
          name: 'Push-ups',
          duration: 60,
          reps: 10,
          sets: 3,
          restTime: 90,
          instructions: ['Keep body straight', 'Lower chest to ground', 'Push up explosively'],
          targetMuscles: ['chest', 'arms', 'core']
        },
        {
          name: 'Squats',
          duration: 60,
          reps: 15,
          sets: 3,
          restTime: 90,
          instructions: ['Feet shoulder-width apart', 'Lower until thighs parallel', 'Drive through heels'],
          targetMuscles: ['legs', 'glutes']
        }
      ],
      caloriesBurn: 250
    }
  ]);

  // New state for advanced features
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [nutritionData, setNutritionData] = useState<NutritionData>({
    id: '1',
    date: new Date(),
    meals: [],
    dailyTotals: {
      calories: 1850,
      protein: 85,
      carbs: 220,
      fat: 65,
      fiber: 28,
      sugar: 45,
      sodium: 1800
    },
    waterIntake: 1800,
    supplements: [
      {
        id: '1',
        name: 'Vitamin D3',
        dosage: '2000 IU',
        timeTaken: new Date(),
        type: 'vitamin'
      },
      {
        id: '2',
        name: 'Omega-3',
        dosage: '1000mg',
        timeTaken: new Date(),
        type: 'omega3'
      }
    ],
    nutritionScore: 82,
    deficiencies: ['Iron', 'Vitamin B12'],
    recommendations: [
      'Increase iron-rich foods like spinach and lean meats',
      'Consider B12 supplementation',
      'Add more colorful vegetables to meals'
    ]
  });

  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData>({
    id: '1',
    timestamp: new Date(),
    location: 'Home',
    airQuality: {
      aqi: 65,
      pm25: 12,
      pm10: 18,
      ozone: 45,
      co2: 420,
      status: 'moderate'
    },
    temperature: 22,
    humidity: 55,
    pressure: 1013,
    uvIndex: 4,
    noiseLevel: 35,
    lightLevel: 300,
    allergens: {
      pollen: 3,
      dust: 2,
      mold: 1
    },
    correlations: [
      {
        factor: 'Air Quality',
        healthMetric: 'Respiratory Rate',
        correlation: -0.65,
        significance: 'high',
        description: 'Poor air quality correlates with increased respiratory rate'
      },
      {
        factor: 'Temperature',
        healthMetric: 'Sleep Quality',
        correlation: -0.45,
        significance: 'moderate',
        description: 'Higher temperatures correlate with reduced sleep quality'
      },
      {
        factor: 'Humidity',
        healthMetric: 'Stress Level',
        correlation: 0.35,
        significance: 'moderate',
        description: 'High humidity correlates with increased stress levels'
      }
    ]
  });

  const [clinicalValidations, setClinicalValidations] = useState<ClinicalValidation[]>([
    {
      algorithmId: 'anomaly_detection_v2',
      validationType: 'fda_clearance',
      status: 'approved',
      certificationBody: 'FDA Center for Devices and Radiological Health',
      validationDate: new Date('2024-01-15'),
      expiryDate: new Date('2027-01-15'),
      studyResults: {
        sensitivity: 0.94,
        specificity: 0.89,
        accuracy: 0.92,
        sampleSize: 15000,
        studyDuration: '18 months'
      },
      clinicalPartners: ['Mayo Clinic', 'Johns Hopkins', 'Stanford Medicine'],
      regulatoryApprovals: ['FDA 510(k)', 'CE Marking']
    },
    {
      algorithmId: 'predictive_insights_v1',
      validationType: 'clinical_trial',
      status: 'in_progress',
      certificationBody: 'National Institutes of Health',
      clinicalPartners: ['Cleveland Clinic', 'Mass General Brigham'],
      regulatoryApprovals: []
    }
  ]);

  const [healthcareProviders, setHealthcareProviders] = useState<HealthcareProvider[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      institution: 'City Medical Center',
      licenseNumber: 'MD12345',
      email: 'dr.johnson@citymedical.com',
      phone: '+1-555-0123',
      dataAccessLevel: 'full',
      consentGiven: true,
      consentDate: new Date('2024-01-01'),
      lastDataShare: new Date()
    }
  ]);

  const [dailyNutritionGoals] = useState({
    calories: 2000,
    protein: 100,
    carbs: 250,
    fat: 70,
    water: 2500
  });

  const anomalyService = AnomalyDetectionService.getInstance();
  const predictiveService = PredictiveAnalyticsService.getInstance();
  const healthKitService = HealthKitService.getInstance();
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();
  const aiService = AIService.getInstance();

  // Add notification when new features are used
  const addNotification = (notification: Omit<any, 'id' | 'timestamp' | 'read'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); // Keep last 20
  };

  // Handle speech recognition results
  useEffect(() => {
    if (transcript) {
      handleSendMessage(transcript);
      resetTranscript();
      
      // Update AI personality
      setAiPersonality(prev => ({
        ...prev,
        lastInteraction: new Date(),
        energy: Math.min(100, prev.energy + 2) // Voice interaction boosts energy
      }));
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

      // Anomaly detection
      setHealthData(currentHealthData => {
        const anomalies = anomalyService.analyzeHealthData(currentHealthData);
        
        // Add data to predictive analytics
        predictiveService.addHealthData(currentHealthData);
        predictiveService.addNutritionData(nutritionData);
        predictiveService.addEnvironmentalData(environmentalData);
        
        if (anomalies.length > 0) {
          setHealthAnomalies(prev => [...prev, ...anomalies]);
          
          // Auto-notify for critical anomalies
          const criticalAnomalies = anomalies.filter(a => a.severity === 'critical');
          if (criticalAnomalies.length > 0) {
            speak(`Critical health anomaly detected: ${criticalAnomalies[0].description}. Please seek immediate medical attention.`);
            
            // Auto-contact emergency services for critical anomalies
            const autoNotifyContacts = emergencyContacts.filter(c => c.autoNotify);
            if (autoNotifyContacts.length > 0) {
              handleContactEmergency(autoNotifyContacts[0].id, criticalAnomalies[0].id);
            }
          }
        }
        return currentHealthData;
      });
      
      // Update AI personality based on health data
      setAiPersonality(prev => ({
        ...prev,
        mood: healthData.stressLevel === 'high' ? 'serious' : 
              healthData.heartRate > 90 ? 'alert' : 'cheerful'
      }));
      
      // Update environmental data periodically
      setEnvironmentalData(prev => ({
        ...prev,
        timestamp: new Date(),
        airQuality: {
          ...prev.airQuality,
          aqi: Math.max(20, Math.min(150, prev.airQuality.aqi + (Math.random() - 0.5) * 10))
        },
        temperature: Math.max(15, Math.min(35, prev.temperature + (Math.random() - 0.5) * 2)),
        humidity: Math.max(30, Math.min(80, prev.humidity + (Math.random() - 0.5) * 5))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, [anomalyService, predictiveService, emergencyContacts, speak, nutritionData, environmentalData]);

  const handleSendMessage = async (content: string) => {
    // Update AI personality
    setAiPersonality(prev => ({
      ...prev,
      lastInteraction: new Date(),
      energy: Math.max(0, prev.energy - 1) // Interaction uses energy
    }));

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

      // Add to notifications for important responses
      if (result.commandExecuted) {
        addNotification({
          type: 'success',
          title: 'Command Executed',
          message: `${result.commandExecuted} completed successfully`
        });
      }

      if (result.commandToExecute) {
        await executeCommand(result.commandToExecute);
      }
      
      // Handle status updates from AI response
      if (result.statusUpdate) {
        setDogStatus(prev => ({ ...prev, ...result.statusUpdate }));
      }
    } catch (error) {
      console.error('Message processing error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Woof! I had trouble understanding that. Could you try rephrasing your command? I might be having connectivity issues with my AI brain! 🤖',
        sender: 'system',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      addNotification({
        type: 'error',
        title: 'Command Processing Error',
        message: 'Failed to process voice/text command'
      });
    }
  };

  const executeCommand = async (command: Command) => {
    setExecutingCommands(prev => new Set([...prev, command.id]));
    setDogStatus(prev => ({ ...prev, currentAction: command.name }));
    
    // Update AI personality favorite commands
    setAiPersonality(prev => {
      const updatedFavorites = [...prev.favoriteCommands];
      if (!updatedFavorites.includes(command.id)) {
        updatedFavorites.push(command.id);
        if (updatedFavorites.length > 5) {
          updatedFavorites.shift();
        }
      }
      return { ...prev, favoriteCommands: updatedFavorites };
    });

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
      addNotification({
        type: 'error',
        title: 'Command Failed',
        message: `Failed to execute ${command.name}`
      });
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
    
    addNotification({
      type: 'security',
      title: 'Camera Status Changed',
      message: `Camera feed ${!dogStatus.cameraActive ? 'activated' : 'deactivated'}`
    });
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
      addNotification({
        type: 'security',
        title: 'Intruder Alert',
        message: 'Motion detected in restricted area',
        actionable: true,
        action: () => setDogStatus(prev => ({ ...prev, currentAction: 'Patrol' })),
        actionLabel: 'Start Patrol'
      });
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

  const handleResolveAnomaly = (anomalyId: string) => {
    setHealthAnomalies(prev => prev.map(anomaly => 
      anomaly.id === anomalyId ? { ...anomaly, resolved: true } : anomaly
    ));
    speak("Health anomaly marked as resolved.");
  };

  const handleContactEmergency = (contactId: string, anomalyId: string) => {
    const contact = emergencyContacts.find(c => c.id === contactId);
    const anomaly = healthAnomalies.find(a => a.id === anomalyId);
    
    if (contact && anomaly) {
      // Mark anomaly as action taken
      setHealthAnomalies(prev => prev.map(a => 
        a.id === anomalyId ? { ...a, actionTaken: true } : a
      ));
      
      speak(`Contacting ${contact.name} about health emergency.`);
      
      // In a real app, this would send SMS/email or make a call
      console.log(`Emergency contact: ${contact.name} (${contact.phone}) - ${anomaly.description}`);
      
      const emergencyMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `🚨 Emergency contact initiated: ${contact.name} has been notified about ${anomaly.description}`,
        sender: 'system',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, emergencyMessage]);
    }
  };

  const handleDismissAnomaly = (anomalyId: string) => {
    setHealthAnomalies(prev => prev.filter(anomaly => anomaly.id !== anomalyId));
  };

  const handleStartWorkout = (planId: string) => {
    const plan = workoutPlans.find(p => p.id === planId);
    if (plan) {
      speak(`Starting ${plan.name} workout. Let's get moving!`);
      setDogStatus(prev => ({ ...prev, emotion: 'excited', currentAction: `Coaching: ${plan.name}` }));
    }
  };

  const handleUpdateFitnessGoals = (goals: Partial<FitnessGoals>) => {
    setFitnessGoals(prev => ({ ...prev, ...goals }));
    speak("Fitness goals updated! I'll help you achieve them.");
  };

  const handleGenerateInsights = () => {
    const insights = predictiveService.generatePredictiveInsights();
    setPredictiveInsights(insights);
    speak("Predictive health insights generated successfully!");
    
    const insightsMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `🔮 Generated ${insights.length} predictive health insights based on your data patterns.`,
      sender: 'system',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, insightsMessage]);
  };

  const handleAcceptRecommendation = (insightId: string) => {
    setPredictiveInsights(prev => prev.map(insight => 
      insight.id === insightId ? { ...insight, actionTaken: true } : insight
    ));
    speak("Recommendation accepted! I'll help you implement this health improvement.");
  };

  const handleLogFood = (food: any) => {
    // In a real app, this would add the food to nutrition data
    speak(`Logged ${food.name || 'food item'} to your nutrition tracker.`);
    
    const logMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `🍎 Food logged: ${food.name || 'Food item'} added to your daily nutrition.`,
      sender: 'system',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, logMessage]);
  };

  const handleLogWater = (amount: number) => {
    setNutritionData(prev => ({
      ...prev,
      waterIntake: prev.waterIntake + amount
    }));
    speak(`Logged ${amount}ml of water. Great job staying hydrated!`);
  };

  const handleLogSupplement = (supplement: any) => {
    speak(`Logged ${supplement.name} supplement.`);
    
    const supplementMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `💊 Supplement logged: ${supplement.name} added to your daily intake.`,
      sender: 'system',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, supplementMessage]);
  };

  const handleScanFood = () => {
    speak("Food scanning activated. Point your camera at the food item.");
    
    const scanMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `📷 Food scanner activated. AI will analyze nutritional content automatically.`,
      sender: 'system',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, scanMessage]);
  };

  const handleRequestValidation = (algorithmId: string) => {
    speak("Requesting clinical validation for health algorithm.");
    
    const validationMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `🏥 Clinical validation requested for ${algorithmId}. Healthcare partners will be contacted.`,
      sender: 'system',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, validationMessage]);
  };

  const handleConnectProvider = (provider: any) => {
    speak(`Connecting to healthcare provider: ${provider.name}.`);
    
    const providerMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `👨‍⚕️ Healthcare provider connection initiated: ${provider.name} will have secure access to your health data.`,
      sender: 'system',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, providerMessage]);
  };

  const handleShareData = (providerId: string, dataTypes: string[]) => {
    const provider = healthcareProviders.find(p => p.id === providerId);
    if (provider) {
      speak(`Sharing health data with ${provider.name}.`);
      
      const shareMessage: ChatMessage = {
        id: Date.now().toString(),
        content: `📊 Health data shared with ${provider.name}: ${dataTypes.join(', ')}`,
        sender: 'system',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, shareMessage]);
    }
  };

  const handleRefreshEnvironmentalData = () => {
    setEnvironmentalData(prev => ({
      ...prev,
      timestamp: new Date(),
      airQuality: {
        ...prev.airQuality,
        aqi: Math.max(20, Math.min(150, prev.airQuality.aqi + (Math.random() - 0.5) * 10))
      },
      temperature: Math.max(15, Math.min(35, prev.temperature + (Math.random() - 0.5) * 2)),
      humidity: Math.max(30, Math.min(80, prev.humidity + (Math.random() - 0.5) * 5))
    }));
    speak("Environmental data refreshed successfully!");
  };

  const handleAddCustomVoiceCommand = (command: VoiceCommand) => {
    setCustomVoiceCommands(prev => [...prev, command]);
    addNotification({
      type: 'success',
      title: 'Voice Command Trained',
      message: `New command "${command.phrases[0]}" learned successfully`
    });
  };

  const handleDeleteVoiceCommand = (commandId: string) => {
    setCustomVoiceCommands(prev => prev.filter(cmd => cmd.id !== commandId));
  };

  const handleSecurityEvent = (event: SecurityEvent) => {
    setSecurityEvents(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 events
    
    if (event.severity === 'high' || event.severity === 'critical') {
      addNotification({
        type: 'security',
        title: 'Security Alert',
        message: `${event.description} at ${event.location}`,
        actionable: true,
        action: () => setDogStatus(prev => ({ ...prev, currentAction: 'Alert Mode' })),
        actionLabel: 'Investigate'
      });
    }
  };

  const handleWeatherUpdate = (weather: WeatherData) => {
    setWeatherData(weather);
    
    // Weather-based health alerts
    if (weather.uvIndex > 8) {
      addNotification({
        type: 'health',
        title: 'High UV Alert',
        message: 'UV index is very high - use sun protection if going outside'
      });
    }
  };

  const handleNotificationAction = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <ErrorBoundary>
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative z-10 container mx-auto px-4 py-6">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-2xl shadow-cyan-500/25">
                <Bot size={32} className="text-white" />
              </div>
              
              {/* Notification Center */}
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={handleNotificationAction}
                onDismiss={handleDismissNotification}
                onClearAll={handleClearAllNotifications}
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              RoboK9 Control Center
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Advanced AI-powered robotic dog control system with voice recognition and intelligent command processing
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Commands */}
            <div className="space-y-6">
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

            {/* Middle Column - Camera Feed & Environment */}
            <div className="space-y-6">
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
              
              {/* Weather Widget */}
              <WeatherWidget onWeatherUpdate={handleWeatherUpdate} />
              
              {/* Security Center */}
              <SecurityCenter onSecurityEvent={handleSecurityEvent} />
              
              {/* Environmental Monitor */}
              <EnvironmentalMonitor
                environmentalData={environmentalData}
                onRefreshData={handleRefreshEnvironmentalData}
                showCorrelations={true}
              />
            </div>

            {/* Right Column - AI & Health */}
            <div className="space-y-6">
              {/* Dog Status */}
              <DogStatus status={dogStatus} />
              
              {/* AI Personality Panel */}
              <AIPersonalityPanel
                personality={aiPersonality}
                onPersonalityUpdate={(update) => setAiPersonality(prev => ({ ...prev, ...update }))}
              />
              
              {/* Voice Command Trainer */}
              <VoiceCommandTrainer
                customCommands={customVoiceCommands}
                onAddCustomCommand={handleAddCustomVoiceCommand}
                onDeleteCommand={handleDeleteVoiceCommand}
              />
              
              {/* Predictive Insights */}
              <PredictiveInsights
                insights={predictiveInsights}
                healthData={healthData}
                nutritionData={nutritionData}
                environmentalData={environmentalData}
                onGenerateInsights={handleGenerateInsights}
                onAcceptRecommendation={handleAcceptRecommendation}
              />
              
              {/* Anomaly Detection */}
              <AnomalyDetector
                anomalies={healthAnomalies}
                emergencyContacts={emergencyContacts}
                onResolveAnomaly={handleResolveAnomaly}
                onContactEmergency={handleContactEmergency}
                onDismissAnomaly={handleDismissAnomaly}
              />
              
              {/* Nutrition Tracker */}
              <NutritionTracker
                nutritionData={nutritionData}
                onLogFood={handleLogFood}
                onLogWater={handleLogWater}
                onLogSupplement={handleLogSupplement}
                onScanFood={handleScanFood}
                dailyGoals={dailyNutritionGoals}
              />
              
              {/* Fitness Coach */}
              <FitnessCoach
                fitnessGoals={fitnessGoals}
                weeklyActivity={weeklyActivity}
                workoutPlans={workoutPlans}
                onStartWorkout={handleStartWorkout}
                onUpdateGoals={handleUpdateFitnessGoals}
                currentHeartRate={healthData.heartRate}
              />
              
              {/* Clinical Validation */}
              <ClinicalValidation
                validations={clinicalValidations}
                healthcareProviders={healthcareProviders}
                onRequestValidation={handleRequestValidation}
                onConnectProvider={handleConnectProvider}
                onShareData={handleShareData}
              />
              
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
          <footer className="mt-8 text-center pb-6">
            <div className="inline-flex items-center space-x-2 text-slate-500 text-sm">
              <Bot size={16} />
              <span>Powered by Advanced AI • RoboK9 v3.0</span>
            </div>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;