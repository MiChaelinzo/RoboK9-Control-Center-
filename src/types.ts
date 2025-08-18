export interface Command {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'movement' | 'advanced' | 'tricks' | 'patrol' | 'entertainment' | 'security';
  emoji: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  commandExecuted?: string;
}

export interface DogStatus {
  online: boolean;
  battery: number;
  currentAction: string;
  location: string;
  cameraActive: boolean;
  intruderDetected: boolean;
  lastIntruderAlert?: Date;
  emotion: 'happy' | 'excited' | 'calm' | 'alert' | 'sleepy' | 'playful' | 'protective';
  nightVisionMode: boolean;
  learningMode: boolean;
  skillsLearned: string[];
  conversationMode: boolean;
}

export interface HealthData {
  heartRate: number;
  steps: number;
  bloodPressure: { systolic: number; diastolic: number };
  bloodOxygen: number;
  sleepHours: number;
  stressLevel: 'low' | 'moderate' | 'high';
  lastSync: Date;
  deviceConnected: boolean;
  deviceType: 'apple_watch' | 'fitbit' | 'samsung' | 'smartphone' | 'none';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: Date;
  taken: boolean;
  importance: 'critical' | 'important' | 'routine';
}

export interface HealthReminder {
  id: string;
  type: 'medication' | 'exercise' | 'hydration' | 'checkup' | 'custom';
  title: string;
  message: string;
  scheduledTime: Date;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}