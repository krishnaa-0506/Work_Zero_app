import { useEffect, useCallback } from 'react';
import { useTTS } from './useTTS';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageNarrationOptions {
  enabled?: boolean;
  delay?: number;
  pathBasedNarration?: Record<string, string>;
  autoRead?: boolean;
}

export const usePageNarration = (options: PageNarrationOptions = {}) => {
  const { speak, stop, isSpeaking, isSupported } = useTTS();
  const { t } = useLanguage();
  const { enabled = true, delay = 250, autoRead = false } = options;

  const readPageContent = useCallback((pageTitle: string, content: string) => {
    if (!enabled || !isSupported) return;
    
    // Add friendly greeting emojis and clean text
    const greeting = "📱 WorkZero App:";
    const cleanTitle = pageTitle.replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '').trim();
    const cleanContent = content.replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F1E0}-\u{1F1FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '').trim();
    
    const fullNarration = `${greeting} ${cleanTitle}. ${cleanContent}`;
    
    const timeout = setTimeout(() => {
      stop();
      speak(fullNarration);
    }, delay);

    return () => clearTimeout(timeout);
  }, [speak, stop, enabled, isSupported, delay]);

  const readCurrentPage = useCallback(() => {
    if (!autoRead || !enabled || !isSupported) return;

    // Get page title and content
    const pageTitle = document.title || 'Page';
    const mainContent = document.querySelector('main, [role="main"], .main-content, #main')?.textContent ||
                       document.querySelector('h1')?.textContent ||
                       'Welcome to WorkZero App';
    
    if (mainContent) {
      const limitedContent = mainContent.substring(0, 300); // Limit for better UX
      readPageContent(pageTitle, limitedContent);
    }
  }, [readPageContent, autoRead, enabled, isSupported]);

  useEffect(() => {
    if (autoRead) {
      // Auto-read when component mounts or path changes
      const timer = setTimeout(readCurrentPage, 1000);
      return () => clearTimeout(timer);
    }
  }, [readCurrentPage, autoRead]);

  return { 
    readPageContent, 
    readCurrentPage,
    speak, 
    stop, 
    isSpeaking,
    isSupported 
  };
};
