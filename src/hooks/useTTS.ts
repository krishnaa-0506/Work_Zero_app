import { useCallback, useRef, useState, useEffect } from 'react';

interface TTSService {
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
}

export const useTTS = (): TTSService => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return;

    // Stop any current speech
    window.speechSynthesis.cancel();

    // Remove emojis and clean up text for better TTS
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Configure voice settings
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Try to use a preferred voice (Hindi/English)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.includes('en-') || voice.lang.includes('hi-')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onpause = () => setIsPaused(true);
    utterance.onresume = () => setIsPaused(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      window.speechSynthesis.pause();
    }
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      window.speechSynthesis.resume();
    }
  }, [isSupported, isPaused]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported
  };
};

// Hook to automatically read page content
export const usePageNarration = (enabled: boolean = false) => {
  const { speak, stop, isSpeaking } = useTTS();
  const [isAutoReading, setIsAutoReading] = useState(enabled);

  const readPageContent = useCallback(() => {
    if (!isAutoReading) return;

    // Get main content from the page
    const content = document.querySelector('main, [role="main"], .main-content, #main')?.textContent ||
                   document.body.textContent;
    
    if (content) {
      const cleanContent = content
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 500); // Limit to first 500 chars for performance
      
      speak(cleanContent);
    }
  }, [speak, isAutoReading]);

  const toggleAutoReading = useCallback(() => {
    setIsAutoReading(prev => !prev);
    if (isSpeaking) {
      stop();
    }
  }, [stop, isSpeaking]);

  useEffect(() => {
    if (isAutoReading) {
      // Small delay to ensure page content is loaded
      const timer = setTimeout(readPageContent, 1000);
      return () => clearTimeout(timer);
    }
  }, [readPageContent, isAutoReading]);

  return {
    isAutoReading,
    toggleAutoReading,
    readPageContent
  };
};