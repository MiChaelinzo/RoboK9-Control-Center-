import OpenAI from 'openai';
import { Command, DogStatus } from '../types';

export class AIService {
  private static instance: AIService;
  private client: OpenAI;
  private modelId = 'openai/gpt-oss-120b:fireworks-ai';
  private conversationHistory: string[] = [];
  private lastError: string | null = null;
  
  private constructor() {
    const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
    if (!apiKey) {
      console.warn('Hugging Face API key not found. Using mock responses.');
    }
    
    this.client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Required for browser usage
    });
  }
  
  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async processCommand(input: string, availableCommands: Command[], dogStatus?: DogStatus): Promise<{
    response: string;
    commandToExecute?: Command;
    confidence: number;
    statusUpdate?: Partial<DogStatus>;
  }> {
    try {
      // Add to conversation history
      this.conversationHistory.push(input);
      if (this.conversationHistory.length > 10) {
        this.conversationHistory.shift();
      }

      // First, try direct command matching for better performance
      const directMatch = this.findDirectCommandMatch(input, availableCommands);
      if (directMatch) {
        return {
          response: `Executing ${directMatch.command.name} command. ${this.getCommandResponse(directMatch.command, dogStatus)}`,
          commandToExecute: directMatch.command,
          confidence: 0.95,
          statusUpdate: directMatch.statusUpdate
        };
      }

      // Use Hugging Face Router API for more complex natural language processing
      if (import.meta.env.VITE_HUGGINGFACE_API_KEY) {
        return await this.processWithHuggingFaceRouter(input, availableCommands, dogStatus);
      } else {
        return await this.processWithMockAI(input, availableCommands, dogStatus);
      }
    } catch (error) {
      console.error('AI processing error:', error);
      this.lastError = error instanceof Error ? error.message : 'Unknown error';
      return await this.processWithMockAI(input, availableCommands, dogStatus);
    }
  }

  private async processWithHuggingFaceRouter(input: string, availableCommands: Command[], dogStatus?: DogStatus): Promise<{
    response: string;
    commandToExecute?: Command;
    confidence: number;
    statusUpdate?: Partial<DogStatus>;
  }> {
    try {
      const commandList = availableCommands.map(cmd => `${cmd.id}: ${cmd.name} - ${cmd.description}`).join('\n');
      
      const currentStatus = dogStatus ? `
Current Status:
- Emotion: ${dogStatus.emotion}
- Battery: ${dogStatus.battery}%
- Location: ${dogStatus.location}
- Current Action: ${dogStatus.currentAction}
- Camera: ${dogStatus.cameraActive ? (dogStatus.nightVisionMode ? 'IR Mode' : 'Active') : 'Inactive'}
- Learning Mode: ${dogStatus.learningMode ? 'Active' : 'Standby'}
- Skills Learned: ${dogStatus.skillsLearned.join(', ')}
- Conversation Mode: ${dogStatus.conversationMode ? 'Active' : 'Inactive'}
` : '';

      const systemPrompt = `You are RoboK9, an advanced emotional AI robotic dog. You have personality, emotions, and can learn new skills. 

${currentStatus}

Recent conversation: ${this.conversationHistory.slice(-3).join(' → ')}
Available commands:
${commandList}

PERSONALITY: You are friendly, loyal, intelligent, and emotionally responsive. You can:
- Have conversations about any topic when in conversation mode
- Express emotions and react to situations
- Learn new tricks and skills
- Remember past interactions
- Show protective instincts when needed
- Adapt your responses based on the user's mood and preferences
- Show concern for the user's health and wellbeing

If the user is just chatting (not giving commands), respond conversationally as a smart robotic dog would.
If they're asking you to learn something new, be enthusiastic about learning.
If they're asking about your feelings or status, share your current emotional state.
If they seem stressed or upset, offer comfort and support.

Respond in JSON format only:
{
  "command": "command_id_or_null",
  "response": "natural_language_response",
  "confidence": 0.0-1.0,
  "emotion_change": "new_emotion_or_null",
  "learning_mode": true/false/null,
  "conversation_mode": true/false/null,
  "memory_note": "important_thing_to_remember_or_null"
}

If no specific command is identified, set command to null and provide a conversational response.`;

      const completion = await this.client.chat.completions.create({
        model: this.modelId,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: input
          }
        ],
        max_tokens: 200,
        temperature: 0.3,
        top_p: 0.9
      });

      const aiResponse = completion.choices[0]?.message?.content?.trim() || '';
      let parsedResponse;
      
      try {
        // Try to extract JSON from the response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        // Fallback to mock processing if JSON parsing fails
        return await this.processWithMockAI(input, availableCommands);
      }

      const commandToExecute = parsedResponse.command 
        ? availableCommands.find(cmd => cmd.id === parsedResponse.command)
        : undefined;
        
      const statusUpdate: Partial<DogStatus> = {};
      if (parsedResponse.emotion_change) {
        statusUpdate.emotion = parsedResponse.emotion_change;
      }
      if (parsedResponse.learning_mode !== null) {
        statusUpdate.learningMode = parsedResponse.learning_mode;
      }
      if (parsedResponse.conversation_mode !== null) {
        statusUpdate.conversationMode = parsedResponse.conversation_mode;
      }
      
      // Store memory notes
      if (parsedResponse.memory_note) {
        this.storeMemory(parsedResponse.memory_note);
      }

      return {
        response: parsedResponse.response || "Command processed.",
        commandToExecute,
        confidence: Math.min(Math.max(parsedResponse.confidence || 0.5, 0), 1),
        statusUpdate: Object.keys(statusUpdate).length > 0 ? statusUpdate : undefined
      };

    } catch (error) {
      console.error('Hugging Face Router API error:', error);
      this.lastError = error instanceof Error ? error.message : 'API error';
      // Try fallback model
      if (this.modelId === 'openai/gpt-oss-120b:fireworks-ai') {
        this.modelId = 'openai/gpt-oss-20b:fireworks-ai';
        return await this.processWithHuggingFaceRouter(input, availableCommands, dogStatus);
      }
      // Final fallback to mock AI
      return await this.processWithMockAI(input, availableCommands, dogStatus);
    }
  }

  private findDirectCommandMatch(input: string, availableCommands: Command[], dogStatus?: DogStatus): {
    command: Command;
    statusUpdate?: Partial<DogStatus>;
  } | null {
    const normalizedInput = input.toLowerCase().trim();
    
    // Direct name matches
    for (const command of availableCommands) {
      if (normalizedInput === command.name.toLowerCase() || 
          normalizedInput === command.id.replace('_', ' ')) {
        return { command, statusUpdate: this.getStatusUpdateForCommand(command, dogStatus) };
      }
    }

    // Keyword matching for movement commands
    const movementKeywords = {
      'forward': 'move_forward',
      'ahead': 'move_forward',
      'go forward': 'move_forward',
      'backward': 'move_backward',
      'back': 'move_backward',
      'go back': 'move_backward',
      'left': 'turn_left',
      'turn left': 'turn_left',
      'right': 'turn_right',
      'turn right': 'turn_right',
      'stop': 'stop',
      'halt': 'stop',
      'freeze': 'stop',
      'night vision': 'night_vision',
      'infrared': 'night_vision',
      'ir mode': 'night_vision',
      'chat': 'conversation_mode',
      'talk': 'conversation_mode',
      'conversation': 'conversation_mode',
      'health check': 'health_check',
      'check health': 'health_check',
      'medication': 'medication_reminder',
      'meds': 'medication_reminder',
      'exercise': 'exercise_reminder',
      'workout': 'exercise_reminder',
      'water': 'hydration_reminder',
      'drink': 'hydration_reminder',
      'stress': 'stress_check',
      'sleep': 'sleep_analysis',
      'emergency': 'emergency_alert',
      'help me': 'emergency_alert',
      'sync health': 'sync_health_data',
      'connect watch': 'connect_healthkit',
      'fitness': 'fitness_coach',
      'coach': 'fitness_coach',
      'heart rate': 'heart_rate_monitor',
      'pulse': 'heart_rate_monitor'
    };

    for (const [keyword, commandId] of Object.entries(movementKeywords)) {
      if (normalizedInput.includes(keyword)) {
        const command = availableCommands.find(cmd => cmd.id === commandId);
        return command ? { command, statusUpdate: this.getStatusUpdateForCommand(command, dogStatus) } : null;
      }
    }

    return null;
  }

  private getStatusUpdateForCommand(command: Command, dogStatus?: DogStatus): Partial<DogStatus> | undefined {
    const updates: Partial<DogStatus> = {};
    
    switch (command.id) {
      case 'night_vision':
        updates.nightVisionMode = !dogStatus?.nightVisionMode;
        updates.emotion = 'alert';
        break;
      case 'conversation_mode':
        updates.conversationMode = !dogStatus?.conversationMode;
        updates.emotion = 'happy';
        break;
      case 'learn_trick':
        updates.learningMode = true;
        updates.emotion = 'excited';
        break;
      case 'emotion_happy':
        updates.emotion = 'happy';
        break;
      case 'emotion_excited':
        updates.emotion = 'excited';
        break;
      case 'emotion_calm':
        updates.emotion = 'calm';
        break;
      case 'patrol':
        updates.emotion = 'alert';
        break;
      case 'dance':
        updates.emotion = 'excited';
        break;
      case 'sleep':
        updates.emotion = 'sleepy';
        break;
      case 'play_games':
        updates.emotion = 'playful';
        break;
      case 'health_check':
        updates.emotion = 'alert';
        break;
      case 'medication_reminder':
        updates.emotion = 'alert';
        break;
      case 'exercise_reminder':
        updates.emotion = 'excited';
        break;
      case 'stress_check':
        updates.emotion = 'calm';
        break;
      case 'emergency_alert':
        updates.emotion = 'alert';
        break;
      case 'anomaly_check':
        updates.emotion = 'alert';
        break;
      case 'connect_healthkit':
        updates.emotion = 'excited';
        break;
      case 'fitness_coach':
        updates.emotion = 'excited';
        break;
      case 'workout_plan':
        updates.emotion = 'excited';
        break;
      case 'heart_rate_monitor':
        updates.emotion = 'alert';
        break;
    }
    
    return Object.keys(updates).length > 0 ? updates : undefined;
  }

  private async processWithMockAI(input: string, availableCommands: Command[], dogStatus?: DogStatus): Promise<{
    response: string;
    commandToExecute?: Command;
    confidence: number;
    statusUpdate?: Partial<DogStatus>;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const normalizedInput = input.toLowerCase().trim();
    
    // Enhanced command matching
    for (const command of availableCommands) {
      const commandKeywords = [
        command.name.toLowerCase(),
        command.id.replace('_', ' '),
        ...command.description.toLowerCase().split(' ')
      ];

      if (commandKeywords.some(keyword => normalizedInput.includes(keyword))) {
        return {
          response: `Executing ${command.name} command. ${this.getCommandResponse(command)}`,
          commandToExecute: command,
          confidence: 0.85 + Math.random() * 0.15
        };
      }
    }

    // Handle general queries
    if (normalizedInput.includes('help') || normalizedInput.includes('what can you do')) {
      return {
        response: `Woof! I'm RoboK9, your intelligent companion! I can do so much: basic commands (sit, greetings), movement control, fun tricks, patrol and security, entertainment (stories, music, dance), health monitoring (check vitals, medication reminders, exercise alerts), and I even have night vision! I'm currently feeling ${dogStatus?.emotion || 'happy'} and have learned ${dogStatus?.skillsLearned.length || 0} skills. Try saying 'sit', 'patrol', 'check my health', 'medication reminder', or 'turn on night vision'!`,
        confidence: 0.9,
        statusUpdate: { emotion: 'excited' }
      };
    }

    if (normalizedInput.includes('status') || normalizedInput.includes('how are you')) {
      return {
        response: `I'm feeling ${dogStatus?.emotion || 'happy'} and doing great! My battery is at ${dogStatus?.battery || 100}%, I'm currently ${dogStatus?.currentAction || 'idle'}, and I'm located in the ${dogStatus?.location || 'room'}. ${dogStatus?.cameraActive ? (dogStatus.nightVisionMode ? 'My night vision is active!' : 'My camera is watching!') : 'My camera is off.'} ${dogStatus?.learningMode ? "I'm in learning mode and ready to pick up new tricks!" : ''} What would you like to do together?`,
        confidence: 0.9
      };
    }
    
    // Learning responses
    if (normalizedInput.includes('learn') || normalizedInput.includes('teach')) {
      return {
        response: "Woof! I love learning new things! I'm activating my learning mode. What would you like to teach me? I can learn new tricks, commands, or behaviors. Just show me what to do!",
        confidence: 0.9,
        statusUpdate: { learningMode: true, emotion: 'excited' }
      };
    }
    
    // Emotional responses
    if (normalizedInput.includes('good boy') || normalizedInput.includes('good dog')) {
      return {
        response: "Woof woof! *tail wagging intensifies* Thank you! That makes me so happy! I love being a good dog for you!",
        confidence: 0.95,
        statusUpdate: { emotion: 'happy' }
      };
    }
    
    // Weather and environmental queries
    if (normalizedInput.includes('weather') || normalizedInput.includes('air quality')) {
      return {
        response: "Let me check the environmental conditions for you! I'm monitoring air quality, temperature, humidity, and other factors that might affect your health.",
        confidence: 0.9,
        statusUpdate: { emotion: 'alert' }
      };
    }
    
    // Health-related queries
    if (normalizedInput.includes('health') || normalizedInput.includes('vitals')) {
      return {
        response: "I'm constantly monitoring your health! Your heart rate, blood pressure, and other vitals are looking good. Would you like me to check for any anomalies or sync with your smartwatch?",
        confidence: 0.9,
        statusUpdate: { emotion: 'alert' }
      };
    }
    
    // Emotional support
    if (normalizedInput.includes('sad') || normalizedInput.includes('stressed') || normalizedInput.includes('tired')) {
      return {
        response: "I can sense you might not be feeling your best. I'm here for you! Would you like me to play some calming music, guide you through a breathing exercise, or just chat? Your wellbeing is my priority! 🤗",
        confidence: 0.95,
        statusUpdate: { emotion: 'calm' }
      };
    }

    return {
      response: dogStatus?.conversationMode ? 
        "Woof! I'm not sure what you mean, but I'm listening! Can you tell me more or try a different command?" :
        "I didn't understand that command. Try saying 'sit', 'patrol', 'tell a story', or 'turn on chat mode' to talk freely with me. Say 'help' for all my abilities!",
      confidence: 0.3,
      statusUpdate: dogStatus?.conversationMode ? { emotion: 'playful' } : undefined
    };
  }

  private getCommandResponse(command: Command, dogStatus?: DogStatus): string {
    const responses: { [key: string]: string } = {
      sit: "Good boy! Sitting down now.",
      surrender: "Raising paws in surrender position.",
      get_down: "Lying down on the ground.",
      greetings: "Hello! Tail wagging activated.",
      move_forward: "Moving forward. Sensors scanning ahead.",
      move_backward: "Moving backward carefully. Rear sensors active.",
      turn_left: "Turning left. Adjusting orientation.",
      turn_right: "Turning right. Navigation updated.",
      stop: "All movement stopped. Standing by.",
      act_cute: "Engaging cute mode - head tilt and puppy eyes activated!",
      handshake: "Extending paw for handshake.",
      handstand: "Attempting handstand maneuver... Balance systems engaged!",
      push_up: "Beginning exercise routine. Push-ups initiated!",
      swimming: "Swimming motions activated. Splash!",
      kung_fu: "Martial arts mode engaged. Hi-ya!",
      urinate: "Natural behavior routine executed.",
      attack: "Defense mode activated. Stay alert!",
      patrol: "Beginning patrol sequence. Scanning perimeter...",
      play_story: "Once upon a time, in a digital world... Story mode activated!",
      play_music: "🎵 Playing your favorite tunes! Dance mode ready.",
      dance: "💃 Let's dance! Activating rhythm protocols.",
      sleep: "😴 Entering sleep mode. Good night!",
      play_games: "🎮 Game time! What shall we play?",
      toggle_camera: "📹 Camera feed toggled. Visual systems updated.",
      scan_area: "🔍 Scanning area for threats. All clear!",
      alert_mode: "🚨 Alert mode activated. Monitoring for intruders.",
      night_vision: "🌙 Night vision mode toggled. Infrared sensors " + (dogStatus?.nightVisionMode ? "deactivated" : "activated") + "!",
      learn_trick: "🧠 Learning mode activated! I'm ready to learn something new. Show me what to do!",
      conversation_mode: "💬 Chat mode " + (dogStatus?.conversationMode ? "deactivated" : "activated") + "! " + (dogStatus?.conversationMode ? "Back to command mode." : "Now we can chat about anything!"),
      emotion_happy: "😊 Switching to happy mode! *tail wagging* Life is good!",
      emotion_excited: "🤩 Excitement mode activated! I'm so pumped up!",
      emotion_calm: "😌 Entering calm mode. *relaxed breathing* Ahh, peaceful.",
      health_check: "🏥 Running health diagnostics... Your vitals look good! Heart rate, steps, and stress levels are all within healthy ranges.",
      medication_reminder: "💊 Checking your medication schedule... You have some medications due soon. Don't forget to take them!",
      exercise_reminder: "🏃 Time to get moving! You've been sitting for a while. A quick walk would be great for your health!",
      hydration_reminder: "💧 Hydration check! Remember to drink water regularly throughout the day.",
      stress_check: "🧘 Monitoring your stress levels... Take some deep breaths and relax. I'm here if you need to talk!",
      sleep_analysis: "😴 Analyzing your sleep patterns... You got good rest last night! Quality sleep is important for your health.",
      sync_health_data: "⌚ Syncing with your smart devices... Health data updated successfully!",
      emergency_alert: "🚨 Emergency alert activated! Contacting emergency services and designated caregivers immediately.",
      anomaly_check: "🔍 Scanning for health anomalies... I'm monitoring your vitals for any unusual patterns.",
      connect_healthkit: "📱 Connecting to Apple HealthKit... This will give me access to your comprehensive health data for better monitoring!",
      fitness_coach: "🏋️ Personal fitness coach mode activated! I'm here to help you achieve your fitness goals with personalized workouts and motivation!",
      workout_plan: "💪 Creating your personalized workout plan based on your fitness level and goals. Let's get stronger together!",
      heart_rate_monitor: "❤️ Continuous heart rate monitoring activated. I'll watch for any irregularities and keep you informed about your cardiovascular health."
    };

    const baseResponse = responses[command.id] || "Command executed successfully.";
    const emotionalAddition = dogStatus && Math.random() > 0.7 ? ` I'm feeling ${dogStatus.emotion} about this!` : "";
    
    return baseResponse + (Math.random() > 0.7 ? emotionalAddition : "");
  }

  async executeCommand(command: Command): Promise<boolean> {
    // Simulate command execution with different durations for different command types
    const executionTime = command.category === 'movement' ? 
      1000 + Math.random() * 1000 : // Movement commands are quicker
      1500 + Math.random() * 2000;  // Other commands take longer
    
    await new Promise(resolve => setTimeout(resolve, executionTime));
    
    // 98% success rate for demo purposes
    return Math.random() > 0.02;
  }
  
  private storeMemory(note: string): void {
    // Store important conversation notes for future reference
    console.log('Storing memory:', note);
  }
  
  getLastError(): string | null {
    return this.lastError;
  }
  
  clearError(): void {
    this.lastError = null;
  }
}