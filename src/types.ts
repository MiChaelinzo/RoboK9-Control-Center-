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
}