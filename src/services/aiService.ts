import OpenAI from 'openai';
import { Command } from '../types';

export class AIService {
  private static instance: AIService;
  private client: OpenAI;
  private modelId = 'openai/gpt-oss-120b:fireworks-ai';
  
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

  async processCommand(input: string, availableCommands: Command[]): Promise<{
    response: string;
    commandToExecute?: Command;
    confidence: number;
  }> {
    try {
      // First, try direct command matching for better performance
      const directMatch = this.findDirectCommandMatch(input, availableCommands);
      if (directMatch) {
        return {
          response: `Executing ${directMatch.name} command. ${this.getCommandResponse(directMatch)}`,
          commandToExecute: directMatch,
          confidence: 0.95
        };
      }

      // Use Hugging Face Router API for more complex natural language processing
      if (import.meta.env.VITE_HUGGINGFACE_API_KEY) {
        return await this.processWithHuggingFaceRouter(input, availableCommands);
      } else {
        return await this.processWithMockAI(input, availableCommands);
      }
    } catch (error) {
      console.error('AI processing error:', error);
      return await this.processWithMockAI(input, availableCommands);
    }
  }

  private async processWithHuggingFaceRouter(input: string, availableCommands: Command[]): Promise<{
    response: string;
    commandToExecute?: Command;
    confidence: number;
  }> {
    try {
      const commandList = availableCommands.map(cmd => `${cmd.id}: ${cmd.name} - ${cmd.description}`).join('\n');
      
      const systemPrompt = `You are an AI assistant controlling a robotic dog. Analyze the user's input and determine which command to execute.

Available commands:
${commandList}

Respond in JSON format only:
{
  "command": "command_id_or_null",
  "response": "natural_language_response",
  "confidence": 0.0-1.0
}

If no specific command is identified, set command to null and provide a helpful response.`;

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

      return {
        response: parsedResponse.response || "Command processed.",
        commandToExecute,
        confidence: Math.min(Math.max(parsedResponse.confidence || 0.5, 0), 1)
      };

    } catch (error) {
      console.error('Hugging Face Router API error:', error);
      // Try fallback model
      if (this.modelId === 'openai/gpt-oss-120b:fireworks-ai') {
        this.modelId = 'openai/gpt-oss-20b:fireworks-ai';
        return await this.processWithHuggingFaceRouter(input, availableCommands);
      }
      // Final fallback to mock AI
      return await this.processWithMockAI(input, availableCommands);
    }
  }

  private findDirectCommandMatch(input: string, availableCommands: Command[]): Command | null {
    const normalizedInput = input.toLowerCase().trim();
    
    // Direct name matches
    for (const command of availableCommands) {
      if (normalizedInput === command.name.toLowerCase() || 
          normalizedInput === command.id.replace('_', ' ')) {
        return command;
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
      'halt': 'stop'
    };

    for (const [keyword, commandId] of Object.entries(movementKeywords)) {
      if (normalizedInput.includes(keyword)) {
        return availableCommands.find(cmd => cmd.id === commandId) || null;
      }
    }

    return null;
  }

  private async processWithMockAI(input: string, availableCommands: Command[]): Promise<{
    response: string;
    commandToExecute?: Command;
    confidence: number;
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
        response: "I can control your robotic dog with various commands like sit, move forward/backward, attack, patrol, tricks, and more. Try saying 'sit', 'move forward', 'patrol', or 'act cute'!",
        confidence: 0.9
      };
    }

    if (normalizedInput.includes('status') || normalizedInput.includes('how are you')) {
      return {
        response: "RoboK9 systems are online and ready for commands. All sensors operational. Movement systems ready.",
        confidence: 0.9
      };
    }

    return {
      response: "I didn't understand that command. Try saying something like 'sit', 'move forward', 'patrol', or 'act cute'. Say 'help' for more options.",
      confidence: 0.3
    };
  }

  private getCommandResponse(command: Command): string {
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
      patrol: "Beginning patrol sequence. Scanning perimeter..."
    };

    return responses[command.id] || "Command executed successfully.";
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
}