import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Volume2 } from 'lucide-react';

const LanguageSelection = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();

  const languages = [
    { code: 'ta' as Language, name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்' },
    { code: 'hi' as Language, name: 'Hindi', flag: '🇮🇳', nativeName: 'हिंदी' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸', nativeName: 'English' },
  ];

  useEffect(() => {
    // Auto-play voice prompt after component mounts
    const timer = setTimeout(() => {
      if (isSupported) {
        speak(t.voicePrompt, { rate: 0.8 });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [speak, t.voicePrompt, isSupported]);

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    
    // Brief confirmation in selected language with welcome message
    const confirmationMessages = {
      en: "English selected. Welcome to Zero Barrier, your voice assistant is ready to help you in English.",
      hi: "हिंदी चुनी गई। ज़ीरो बैरियर में आपका स्वागत है, आपका आवाज़ सहायक हिंदी में आपकी सहायता के लिए तैयार है।",
      ta: "தமிழ் தேர்ந்தெடுக்கப்பட்டது। ஜீரோ பேரியருக்கு வரவேற்கிறோம், உங்கள் குரல் உதவியாளர் தமிழில் உங்களுக்கு உதவ தயாராக உள்ளது."
    };
    
    if (isSupported) {
      speak(confirmationMessages[langCode], { rate: 0.8 });
    }
    
    // Navigate after voice completion
    setTimeout(() => {
      navigate('/signup');
    }, 3000);
  };

  const testLanguageVoice = (langCode: Language) => {
    // Temporarily set language to test voice
    const testMessages = {
      en: "This is how I sound in English. I can help you find jobs and complete applications.",
      hi: "यह हिंदी में मेरी आवाज़ है। मैं आपको नौकरी ढूंढने और आवेदन पूरा करने में मदद कर सकता हूं।",
      ta: "தமிழில் நான் இப்படித்தான் பேசுவேன். வேலை தேடுவதிலும் விண்ணப்பங்களை முடிப்பதிலும் உங்களுக்கு உதவ முடியும்."
    };
    
    // Create temporary utterance with specific language
    if (window.speechSynthesis) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(testMessages[langCode]);
      const langCodes = { 'en': 'en-US', 'hi': 'hi-IN', 'ta': 'ta-IN' };
      utterance.lang = langCodes[langCode];
      utterance.rate = 0.7; // Slower for better pronunciation
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Enhanced voice selection for Tamil
      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = null;
        
        if (langCode === 'ta') {
          // Debug: Show available voices for Tamil
          console.log('Testing Tamil - Available voices:', voices.map(v => ({
            name: v.name,
            lang: v.lang,
            localService: v.localService
          })));
          
          // Try multiple Tamil voice options
          selectedVoice = voices.find(v => v.lang === 'ta-IN') ||
                          voices.find(v => v.lang === 'ta') ||
                          voices.find(v => v.lang.includes('ta-')) ||
                          voices.find(v => v.name.toLowerCase().includes('tamil')) ||
                          voices.find(v => v.name.toLowerCase().includes('lekha')) ||
                          voices.find(v => v.name.toLowerCase().includes('shruti')) ||
                          voices.find(v => v.name.toLowerCase().includes('karthika')) ||
                          // Fallback to any Indian voice
                          voices.find(v => v.lang.includes('IN') && v.localService);
          
          console.log('Selected Tamil voice for testing:', selectedVoice ? {
            name: selectedVoice.name,
            lang: selectedVoice.lang
          } : 'No Tamil voice found - will use default');
        } else if (langCode === 'hi') {
          selectedVoice = voices.find(v => v.lang === 'hi-IN') ||
                          voices.find(v => v.lang === 'hi') ||
                          voices.find(v => v.name.toLowerCase().includes('hindi'));
        } else {
          selectedVoice = voices.find(v => v.lang === 'en-IN') ||
                          voices.find(v => v.lang === 'en-US') ||
                          voices.find(v => v.lang.startsWith('en'));
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang}) for ${langCode}`);
        } else {
          console.warn(`No suitable voice found for ${langCode}, using default`);
        }
        
        // Force Tamil language setting
        if (langCode === 'ta') {
          utterance.lang = 'ta-IN';
        }
        
        window.speechSynthesis.speak(utterance);
      };
      
      // Wait for voices to load
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoiceAndSpeak();
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          setVoiceAndSpeak();
          window.speechSynthesis.onvoiceschanged = null;
        };
      }
    }
  };

  const playVoicePrompt = () => {
    if (isSupported) {
      speak(t.voicePrompt, { rate: 0.8 });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
            🌐
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t.chooseLanguage}
          </h1>
          
          {/* Voice prompt button */}
          {isSupported && (
            <Button 
              onClick={playVoicePrompt}
              variant="outline" 
              size="sm"
              className="mb-6"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {t.tapToSpeak}
            </Button>
          )}
        </div>

        {/* Language options */}
        <div className="space-y-4">
          {languages.map((lang) => (
            <div key={lang.code} className="relative">
              <Button
                onClick={() => handleLanguageSelect(lang.code)}
                variant={language === lang.code ? "default" : "outline"}
                size="lg"
                className="w-full h-16 text-left justify-start space-x-4 hover:scale-105 transition-transform pr-16"
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{lang.nativeName}</span>
                  <span className="text-sm opacity-75">{lang.name}</span>
                </div>
              </Button>
              
              {/* Voice test button */}
              {isSupported && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    testLanguageVoice(lang.code);
                  }}
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
                  title={`Test ${lang.name} voice`}
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Voice support indicator */}
        {isSupported && (
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground flex items-center justify-center space-x-2">
              <Volume2 className="w-4 h-4" />
              <span>{t.voiceSupport}</span>
            </p>
            
            {/* Direct Tamil Test Button */}
            <div className="space-y-2">
              <Button
                onClick={() => {
                  // Direct Tamil test without language change
                  window.speechSynthesis.cancel();
                  const utterance = new SpeechSynthesisUtterance("வணக்கம். நான் தமிழில் பேசுகிறேன்.");
                  utterance.lang = 'ta-IN';
                  utterance.rate = 0.6;
                  utterance.pitch = 1.1;
                  
                  // Force Tamil voice
                  setTimeout(() => {
                    const voices = window.speechSynthesis.getVoices();
                    console.log('Direct Tamil test - Available voices:', voices.length);
                    const tamilVoice = voices.find(v => v.lang.includes('ta')) || 
                                      voices.find(v => v.name.toLowerCase().includes('tamil'));
                    
                    if (tamilVoice) {
                      utterance.voice = tamilVoice;
                      console.log('Using Tamil voice:', tamilVoice.name);
                    } else {
                      console.log('No Tamil voice found, using default with ta-IN language');
                    }
                    
                    window.speechSynthesis.speak(utterance);
                  }, 100);
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                🔊 Test Tamil Voice Directly
              </Button>
              
              <p className="text-xs text-muted-foreground">
                If Tamil doesn't work, your browser may not have Tamil voice support
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelection;