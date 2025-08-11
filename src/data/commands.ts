import { Command } from '../types';

export const commands: Command[] = [
  // Basic Commands
  { id: 'sit', name: 'Sit', description: 'Make the dog sit down', category: 'basic', emoji: '🪑' },
  { id: 'surrender', name: 'Surrender', description: 'Raise front paws in surrender pose', category: 'basic', emoji: '🙌' },
  { id: 'get_down', name: 'Get Down', description: 'Lie down on the ground', category: 'basic', emoji: '⬇️' },
  { id: 'greetings', name: 'Greetings', description: 'Friendly greeting gesture', category: 'basic', emoji: '👋' },
  
  // Movement Commands
  { id: 'move_forward', name: 'Move Forward', description: 'Walk forward', category: 'movement', emoji: '⬆️' },
  { id: 'move_backward', name: 'Move Backward', description: 'Walk backward', category: 'movement', emoji: '⬇️' },
  { id: 'turn_left', name: 'Turn Left', description: 'Turn to the left', category: 'movement', emoji: '⬅️' },
  { id: 'turn_right', name: 'Turn Right', description: 'Turn to the right', category: 'movement', emoji: '➡️' },
  { id: 'stop', name: 'Stop', description: 'Stop all movement', category: 'movement', emoji: '🛑' },
  
  // Tricks
  { id: 'act_cute', name: 'Act Cute', description: 'Perform cute behaviors', category: 'tricks', emoji: '🥰' },
  { id: 'handshake', name: 'Handshake', description: 'Offer paw for handshake', category: 'tricks', emoji: '🤝' },
  { id: 'handstand', name: 'Handstand', description: 'Perform a handstand trick', category: 'tricks', emoji: '🤸' },
  { id: 'push_up', name: 'Push-up', description: 'Do push-up exercises', category: 'tricks', emoji: '💪' },
  
  // Advanced Actions
  { id: 'swimming', name: 'Swimming', description: 'Swimming motion simulation', category: 'advanced', emoji: '🏊' },
  { id: 'kung_fu', name: 'Kung-Fu', description: 'Martial arts demonstration', category: 'advanced', emoji: '🥋' },
  { id: 'urinate', name: 'Urinate', description: 'Natural behavior simulation', category: 'advanced', emoji: '💦' },
  { id: 'attack', name: 'Attack', description: 'Defensive/protective mode', category: 'advanced', emoji: '⚡' },
  
  // Patrol
  { id: 'patrol', name: 'Patrol', description: 'Begin patrol sequence', category: 'patrol', emoji: '🛡️' },
];