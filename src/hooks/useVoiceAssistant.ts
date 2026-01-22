import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface VoiceAssistantOptions {
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

export const useVoiceAssistant = (options: VoiceAssistantOptions = {}) => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Language mapping for speech recognition and synthesis
  const getLanguageCode = (lang: string) => {
    const codes = {
      'en': 'en-US',
      'hi': 'hi-IN', 
      'ta': 'ta-IN'
    };
    return codes[lang as keyof typeof codes] || 'en-US';
  };

  // Get language-specific voice prompts
  const getVoicePrompts = (lang: string) => {
    const prompts = {
      'en': {
        listening: 'I am listening...',
        speakNow: 'Please speak now',
        voiceNotSupported: 'Voice recognition is not supported in this browser',
        errorOccurred: 'An error occurred with voice recognition'
      },
      'hi': {
        listening: 'मैं सुन रहा हूं...',
        speakNow: 'कृपया अब बोलें',
        voiceNotSupported: 'इस ब्राउज़र में आवाज़ पहचान समर्थित नहीं है',
        errorOccurred: 'आवाज़ पहचान में त्रुटि हुई'
      },
      'ta': {
        listening: 'நான் கேட்டுக்கொண்டிருக்கிறேன்...',
        speakNow: 'தயவுசெய்து இப்போது பேசவும்',
        voiceNotSupported: 'இந்த உலாவியில் குரல் அங்கீகாரம் ஆதரிக்கப்படவில்லை',
        errorOccurred: 'குரல் அங்கீகாரத்தில் பிழை ஏற்பட்டது'
      }
    };
    return prompts[lang as keyof typeof prompts] || prompts['en'];
  };

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      synthRef.current = speechSynthesis;
      
      const recognition = recognitionRef.current;
      recognition.continuous = options.continuous || false;
      recognition.interimResults = options.interimResults || true;
      recognition.lang = getLanguageCode(language);
      
      console.log(`Voice Assistant initialized for language: ${language} (${getLanguageCode(language)})`);
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        
        if (options.onResult) {
          options.onResult(fullTranscript, !!finalTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        const errorMsg = `Speech recognition error: ${event.error}`;
        setError(errorMsg);
        setIsListening(false);
        if (options.onError) {
          options.onError(errorMsg);
        }
      };
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, options.continuous, options.interimResults]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        setError('Failed to start speech recognition');
        console.error('Speech recognition start error:', err);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const speak = useCallback((text: string, options: { rate?: number; pitch?: number; volume?: number } = {}) => {
    if (synthRef.current) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      const langCode = getLanguageCode(language);
      utterance.lang = langCode;
      utterance.rate = options.rate || 0.8;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      
      // Wait for voices to load if they haven't already
      const setVoiceAndSpeak = () => {
        const voices = synthRef.current?.getVoices() || [];
        
        // Debug: Log available voices for Tamil
        if (language === 'ta') {
          console.log('Available voices for Tamil:', voices.map(v => ({
            name: v.name,
            lang: v.lang,
            localService: v.localService
          })));
        }
        
        // Enhanced voice selection for Indian languages with better priority
        let selectedVoice = null;
        
        if (language === 'hi') {
          // Hindi voice selection with priority order
          selectedVoice = voices.find(voice => voice.lang === 'hi-IN') ||
                          voices.find(voice => voice.lang === 'hi') ||
                          voices.find(voice => voice.name.toLowerCase().includes('hindi')) ||
                          voices.find(voice => voice.name.toLowerCase().includes('devanagari')) ||
                          voices.find(voice => voice.name.toLowerCase().includes('neer')) ||
                          voices.find(voice => voice.name.toLowerCase().includes('kalpana'));
        } else if (language === 'ta') {
          // Tamil voice selection with extensive fallbacks
          selectedVoice = voices.find(voice => voice.lang === 'ta-IN') ||
                          voices.find(voice => voice.lang === 'ta') ||
                          voices.find(voice => voice.lang.includes('ta-')) ||
                          voices.find(voice => voice.name.toLowerCase().includes('tamil')) ||
                          voices.find(voice => voice.name.toLowerCase().includes('lekha')) ||
                          voices.find(voice => voice.name.toLowerCase().includes('shruti')) ||
                          voices.find(voice => voice.name.toLowerCase().includes('karthika')) ||
                          voices.find(voice => voice.name.toLowerCase().includes('veena')) ||
                          // Try any voice that might support Tamil
                          voices.find(voice => voice.name.toLowerCase().includes('indian')) ||
                          voices.find(voice => voice.lang.includes('IN') && voice.localService);
          
          console.log('Selected Tamil voice:', selectedVoice ? {
            name: selectedVoice.name,
            lang: selectedVoice.lang,
            localService: selectedVoice.localService
          } : 'No Tamil voice found');
        } else {
          // English voice selection with Indian English priority
          selectedVoice = voices.find(voice => voice.lang === 'en-IN') ||
                          voices.find(voice => voice.lang === 'en-US') ||
                          voices.find(voice => voice.lang.startsWith('en')) ||
                          voices.find(voice => voice.name.toLowerCase().includes('ravi')) ||
                          voices.find(voice => voice.name.toLowerCase().includes('veena'));
        }
        
        // Secondary fallback - try exact language match
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.startsWith(language));
        }
        
        // Tertiary fallback - try language code in name or lang
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.lang.toLowerCase().includes(language) ||
            voice.name.toLowerCase().includes(language)
          );
        }
        
        // Final fallback - use any available voice
        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices[0];
          console.warn(`Using fallback voice for language: ${language}`);
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log(`Selected voice: ${selectedVoice.name} (${selectedVoice.lang}) for language: ${language}`);
        } else {
          console.warn(`No suitable voice found for language: ${language}`);
        }
        
        // Add error handling for speech synthesis
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error);
        };
        
        utterance.onend = () => {
          console.log('Speech synthesis completed');
        };
        
        synthRef.current?.speak(utterance);
      };
      
      // Check if voices are loaded
      const voices = synthRef.current.getVoices();
      if (voices.length > 0) {
        setVoiceAndSpeak();
      } else {
        // Wait for voices to load
        synthRef.current.onvoiceschanged = () => {
          setVoiceAndSpeak();
          synthRef.current!.onvoiceschanged = null;
        };
        
        // Fallback timeout in case voices don't load
        setTimeout(() => {
          if (synthRef.current?.getVoices().length === 0) {
            console.warn('Voices failed to load, speaking without voice selection');
            synthRef.current?.speak(utterance);
          }
        }, 1000);
      }
    }
  }, [language]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, []);

  // Get available voices for current language
  const getAvailableVoices = useCallback(() => {
    if (!synthRef.current) return [];
    
    const voices = synthRef.current.getVoices();
    return voices.filter(voice => 
      voice.lang.startsWith(language) ||
      voice.lang.toLowerCase().includes(language) ||
      voice.name.toLowerCase().includes(language)
    );
  }, [language]);

  // Test voice in current language
  const testVoice = useCallback(() => {
    const prompts = getVoicePrompts(language);
    speak(prompts.speakNow);
  }, [language, speak]);

  // Get welcome message in current language
  const getWelcomeMessage = useCallback(() => {
    const messages = {
      'en': 'Welcome to Zero Barrier. I am your voice assistant.',
      'hi': 'ज़ीरो बैरियर में आपका स्वागत है। मैं आपका आवाज़ सहायक हूं।',
      'ta': 'ஜீரோ பேரியருக்கு வரவேற்கிறோம். நான் உங்கள் குரல் உதவியாளர்.'
    };
    return messages[language as keyof typeof messages] || messages['en'];
  }, [language]);

  return {
    isListening,
    isSupported,
    transcript,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    getAvailableVoices,
    testVoice,
    getWelcomeMessage,
    getVoicePrompts: () => getVoicePrompts(language),
  };
};

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}