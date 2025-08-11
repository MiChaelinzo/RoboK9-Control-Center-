import { useCallback } from 'react';

export const useSpeechSynthesis = () => {
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Try to use a more robotic/futuristic voice if available
      const voices = speechSynthesis.getVoices();
      const roboticVoice = voices.find(voice => 
        voice.name.includes('Daniel') || 
        voice.name.includes('Alex') ||
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      );
      
      if (roboticVoice) {
        utterance.voice = roboticVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  }, []);

  const isSupported = 'speechSynthesis' in window;

  return { speak, isSupported };
};