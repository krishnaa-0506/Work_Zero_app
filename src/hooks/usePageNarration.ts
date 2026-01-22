import { useEffect } from 'react';
import { useVoiceAssistant } from './useVoiceAssistant';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageNarrationOptions {
  enabled?: boolean;
  delay?: number;
  pathBasedNarration?: Record<string, string>;
}

export const usePageNarration = (options: PageNarrationOptions = {}) => {
  const { speak, stopSpeaking, isSupported } = useVoiceAssistant();
  const { t } = useLanguage();
  const { enabled = true, delay = 250 } = options;

  const readPageContent = (pageTitle: string, content: string) => {
    if (!enabled || !isSupported) return;
    
    const fullNarration = `${pageTitle}. ${content}`;
    
    const timeout = setTimeout(() => {
      stopSpeaking();
      speak(fullNarration, { rate: 0.85 });
    }, delay);

    return () => clearTimeout(timeout);
  };

  return { readPageContent, speak, stopSpeaking, isSupported };
};
