import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Settings as SettingsIcon, Globe, 
  Bell, Moon, Sun, Volume2, LogOut, Shield, MapPin,
  Clock, Smartphone, Wifi, WifiOff, Battery, Signal,
  Eye, Database, Trash2, Download, Upload, RefreshCw,
  User, Lock, CreditCard, HelpCircle, MessageSquare,
  Calendar, Zap, Activity, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();
  const [userType, setUserType] = useState<'worker' | 'company'>('worker');
  const [settings, setSettings] = useState({
    darkMode: false,
    pushNotifications: true,
    emailNotifications: true,
    voiceAssistant: true,
    locationServices: true,
    realTimeSync: true,
    autoBackup: true,
    biometricAuth: false,
    workModeReminder: true,
    batteryOptimization: true,
    dataCompression: true,
    offlineMode: false,
    highContrastMode: false,
    largeText: false,
    reduceMotion: false,
    soundEnabled: true,
    hapticFeedback: true,
    smartNotifications: true,
    workingHoursOnly: false,
    weekendNotifications: false,
    emergencyAlerts: true,
    jobMatchNotifications: true,
    paymentReminders: true,
    reviewReminders: true
  });

  const [systemInfo, setSystemInfo] = useState({
    isOnline: navigator.onLine,
    batteryLevel: 85,
    connectionType: 'wifi',
    lastSync: new Date().toLocaleTimeString(),
    storageUsed: 45,
    cacheSize: 12.5
  });

  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '18:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  useEffect(() => {
    // Get user type from localStorage
    const storedUserType = localStorage.getItem('userType') as 'worker' | 'company';
    if (storedUserType) {
      setUserType(storedUserType);
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }

    // Load working hours
    const savedWorkingHours = localStorage.getItem('workingHours');
    if (savedWorkingHours) {
      setWorkingHours(JSON.parse(savedWorkingHours));
    }

    // Voice welcome message for settings
    const settingsWelcome = sessionStorage.getItem('settingsWelcome');
    if (!settingsWelcome && isSupported) {
      setTimeout(() => {
        const welcomeMessages = {
          'en': 'Welcome to Settings. You can customize your voice assistant and test different languages here.',
          'hi': 'सेटिंग्स में आपका स्वागत है। आप यहां अपना आवाज़ सहायक कस्टमाइज़ कर सकते हैं और विभिन्न भाषाओं का परीक्षण कर सकते हैं।',
          'ta': 'அமைப்புகளுக்கு வரவேற்கிறோம். இங்கே உங்கள் குரல் உதவியாளரை தனிப்பயனாக்கலாம் மற்றும் வெவ்வேறு மொழிகளை சோதிக்கலாம்.'
        };
        speak(welcomeMessages[language as keyof typeof welcomeMessages] || welcomeMessages['en'], { rate: 0.8 });
        sessionStorage.setItem('settingsWelcome', 'true');
      }, 1000);
    }

    // Real-time system monitoring
    const updateSystemInfo = () => {
      setSystemInfo(prev => ({
        ...prev,
        isOnline: navigator.onLine,
        lastSync: new Date().toLocaleTimeString(),
        connectionType: (navigator as any).connection?.effectiveType || 'unknown'
      }));
    };

    // Update system info every 30 seconds
    const interval = setInterval(updateSystemInfo, 30000);

    // Listen for online/offline events
    window.addEventListener('online', updateSystemInfo);
    window.addEventListener('offline', updateSystemInfo);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', updateSystemInfo);
      window.removeEventListener('offline', updateSystemInfo);
    };
  }, []);

  const handleSettingChange = (key: string, value: boolean | string | number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    
    if (isSupported && typeof value === 'boolean') {
      speak(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
    }
    
    toast.success(`Setting updated successfully`);
  };

  const handleWorkingHoursChange = (key: string, value: string) => {
    const newHours = { ...workingHours, [key]: value };
    setWorkingHours(newHours);
    localStorage.setItem('workingHours', JSON.stringify(newHours));
    toast.success('Working hours updated');
  };

  const clearCache = () => {
    localStorage.removeItem('appCache');
    setSystemInfo(prev => ({ ...prev, cacheSize: 0 }));
    toast.success('Cache cleared successfully');
  };

  const syncData = async () => {
    toast.loading('Syncing data...');
    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSystemInfo(prev => ({ ...prev, lastSync: new Date().toLocaleTimeString() }));
    toast.success('Data synced successfully');
  };

  const exportData = () => {
    const data = {
      settings,
      profile: localStorage.getItem('zeroBarrierUser'),
      workingHours
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employ-assist-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Data exported successfully');
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    if (isSupported) {
      const confirmationText = {
        en: "Language changed to English",
        hi: "भाषा हिंदी में बदली गई",
        ta: "மொழி தமிழுக்கு மாற்றப்பட்டது"
      };
      speak(confirmationText[newLanguage]);
    }
    toast.success("Language updated successfully");
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    if (isSupported) {
      speak("Logged out successfully");
    }
    toast.success("Logged out successfully");
    navigate('/');
  };

  const handleBackNavigation = () => {
    if (userType === 'company') {
      navigate('/home');
    } else {
      navigate('/home');
    }
  };

  const languages = [
    { code: 'en' as Language, name: 'English', nativeName: 'English' },
    { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'ta' as Language, name: 'Tamil', nativeName: 'தமிழ்' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className={`${userType === 'company' ? 'bg-gradient-accent' : 'bg-gradient-primary'} text-white p-6`}>
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleBackNavigation}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <SettingsIcon className="w-6 h-6" />
            <h1 className="text-2xl font-bold">{t.settings}</h1>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 pb-6">
        {/* System Status */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>System Status</span>
              <Badge variant={systemInfo.isOnline ? "default" : "destructive"} className="ml-auto">
                {systemInfo.isOnline ? (
                  <><Wifi className="w-3 h-3 mr-1" />Online</>
                ) : (
                  <><WifiOff className="w-3 h-3 mr-1" />Offline</>
                )}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Signal className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Connection</span>
                </div>
                <p className="text-xs text-muted-foreground capitalize">{systemInfo.connectionType}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Last Sync</span>
                </div>
                <p className="text-xs text-muted-foreground">{systemInfo.lastSync}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Database className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">Storage</span>
                </div>
                <p className="text-xs text-muted-foreground">{systemInfo.storageUsed}% used</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Cache</span>
                </div>
                <p className="text-xs text-muted-foreground">{systemInfo.cacheSize} MB</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={syncData} variant="outline" size="sm" className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Now
              </Button>
              <Button onClick={clearCache} variant="outline" size="sm" className="flex-1">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button onClick={() => navigate(`/${userType}/profile`)} variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={() => navigate('/help')} variant="outline" size="sm">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
            <Button onClick={() => navigate('/feedback')} variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Feedback
            </Button>
          </CardContent>
        </Card>

        {/* Language & Localization */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>Language & Region</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center space-x-2">
                        <span>{lang.nativeName}</span>
                        <span className="text-muted-foreground">({lang.name})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Timezone</label>
              <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                <MapPin className="w-4 h-4 inline mr-2" />
                {workingHours.timezone}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Working Hours</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Start Time</label>
                <input
                  type="time"
                  value={workingHours.start}
                  onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">End Time</label>
                <input
                  type="time"
                  value={workingHours.end}
                  onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Work Mode Reminders</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified during your working hours
                </p>
              </div>
              <Switch
                checked={settings.workModeReminder}
                onCheckedChange={(checked) => handleSettingChange('workModeReminder', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Smart Notifications */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Smart Notifications</span>
              <Badge variant="secondary">AI Powered</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Smart Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered notifications based on your activity
                </p>
              </div>
              <Switch
                checked={settings.smartNotifications}
                onCheckedChange={(checked) => handleSettingChange('smartNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Job Match Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when jobs match your skills
                </p>
              </div>
              <Switch
                checked={settings.jobMatchNotifications}
                onCheckedChange={(checked) => handleSettingChange('jobMatchNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Payment Reminders</h3>
                <p className="text-sm text-muted-foreground">
                  Reminders for pending payments
                </p>
              </div>
              <Switch
                checked={settings.paymentReminders}
                onCheckedChange={(checked) => handleSettingChange('paymentReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Review Reminders</h3>
                <p className="text-sm text-muted-foreground">
                  Reminders to leave and request reviews
                </p>
              </div>
              <Switch
                checked={settings.reviewReminders}
                onCheckedChange={(checked) => handleSettingChange('reviewReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Working Hours Only</h3>
                <p className="text-sm text-muted-foreground">
                  Only receive notifications during work hours
                </p>
              </div>
              <Switch
                checked={settings.workingHoursOnly}
                onCheckedChange={(checked) => handleSettingChange('workingHoursOnly', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Emergency Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Critical notifications (always enabled)
                </p>
              </div>
              <Switch
                checked={settings.emergencyAlerts}
                onCheckedChange={(checked) => handleSettingChange('emergencyAlerts', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Privacy & Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Location Services</h3>
                <p className="text-sm text-muted-foreground">
                  Allow app to access your location for job matching
                </p>
              </div>
              <Switch
                checked={settings.locationServices}
                onCheckedChange={(checked) => handleSettingChange('locationServices', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Biometric Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Use fingerprint/face unlock for app access
                </p>
              </div>
              <Switch
                checked={settings.biometricAuth}
                onCheckedChange={(checked) => handleSettingChange('biometricAuth', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto Backup</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically backup your data securely
                </p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Performance */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Real-time Sync</h3>
                <p className="text-sm text-muted-foreground">
                  Keep data synchronized in real-time
                </p>
              </div>
              <Switch
                checked={settings.realTimeSync}
                onCheckedChange={(checked) => handleSettingChange('realTimeSync', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Battery Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Optimize app for better battery life
                </p>
              </div>
              <Switch
                checked={settings.batteryOptimization}
                onCheckedChange={(checked) => handleSettingChange('batteryOptimization', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Data Compression</h3>
                <p className="text-sm text-muted-foreground">
                  Reduce data usage with compression
                </p>
              </div>
              <Switch
                checked={settings.dataCompression}
                onCheckedChange={(checked) => handleSettingChange('dataCompression', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Offline Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Enable offline functionality
                </p>
              </div>
              <Switch
                checked={settings.offlineMode}
                onCheckedChange={(checked) => handleSettingChange('offlineMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Accessibility</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Voice Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Enable voice prompts and speech recognition
                </p>
              </div>
              <Switch
                checked={settings.voiceAssistant}
                onCheckedChange={(checked) => handleSettingChange('voiceAssistant', checked)}
                disabled={!isSupported}
              />
            </div>

            {/* Voice Language Testing */}
            {isSupported && settings.voiceAssistant && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-sm">Voice Language Testing</h4>
                <p className="text-xs text-muted-foreground">
                  Test how the voice assistant sounds in different languages
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const msg = "This is how I sound in English. I can help you find jobs and complete applications.";
                      speak(msg, { rate: 0.8 });
                    }}
                    className="text-xs"
                  >
                    🇺🇸 English
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const msg = "यह हिंदी में मेरी आवाज़ है। मैं आपको नौकरी ढूंढने में मदद कर सकता हूं।";
                      if (window.speechSynthesis) {
                        const utterance = new SpeechSynthesisUtterance(msg);
                        utterance.lang = 'hi-IN';
                        utterance.rate = 0.8;
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                    className="text-xs"
                  >
                    🇮🇳 हिंदी
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const msg = "தமிழில் நான் இப்படித்தான் பேசுவேன். வேலை தேடுவதில் உங்களுக்கு உதவ முடியும்।";
                      if (window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                        
                        const utterance = new SpeechSynthesisUtterance(msg);
                        utterance.lang = 'ta-IN';
                        utterance.rate = 0.7;
                        utterance.pitch = 1.0;
                        utterance.volume = 1.0;
                        
                        // Enhanced Tamil voice selection
                        const setTamilVoice = () => {
                          const voices = window.speechSynthesis.getVoices();
                          const tamilVoice = voices.find(v => v.lang === 'ta-IN') ||
                                            voices.find(v => v.lang === 'ta') ||
                                            voices.find(v => v.lang.includes('ta-')) ||
                                            voices.find(v => v.name.toLowerCase().includes('tamil')) ||
                                            voices.find(v => v.name.toLowerCase().includes('lekha')) ||
                                            voices.find(v => v.lang.includes('IN') && v.localService);
                          
                          if (tamilVoice) {
                            utterance.voice = tamilVoice;
                            console.log('Using Tamil voice:', tamilVoice.name, tamilVoice.lang);
                          } else {
                            console.warn('No Tamil voice found, using default');
                          }
                          
                          window.speechSynthesis.speak(utterance);
                        };
                        
                        if (window.speechSynthesis.getVoices().length > 0) {
                          setTamilVoice();
                        } else {
                          window.speechSynthesis.onvoiceschanged = () => {
                            setTamilVoice();
                            window.speechSynthesis.onvoiceschanged = null;
                          };
                        }
                      }
                    }}
                    className="text-xs"
                  >
                    🇮🇳 தமிழ்
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground space-y-2">
                  <div>
                    Current language: <Badge variant="secondary">{language === 'en' ? 'English' : language === 'hi' ? 'हिंदी' : 'தமிழ்'}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const voices = window.speechSynthesis?.getVoices() || [];
                      console.log('=== VOICE DIAGNOSTICS ===');
                      console.log('Total voices available:', voices.length);
                      console.log('Tamil voices:', voices.filter(v => 
                        v.lang.includes('ta') || v.name.toLowerCase().includes('tamil')
                      ));
                      console.log('Hindi voices:', voices.filter(v => 
                        v.lang.includes('hi') || v.name.toLowerCase().includes('hindi')
                      ));
                      console.log('English voices:', voices.filter(v => 
                        v.lang.includes('en')
                      ));
                      console.log('All voices:', voices.map(v => ({
                        name: v.name,
                        lang: v.lang,
                        localService: v.localService,
                        default: v.default
                      })));
                      
                      // Test simple Tamil phrase
                      if (voices.length > 0) {
                        const testUtterance = new SpeechSynthesisUtterance("தமிழ் சோதனை");
                        testUtterance.lang = 'ta-IN';
                        window.speechSynthesis.speak(testUtterance);
                      }
                      
                      alert('Voice diagnostics logged to console. Check browser developer tools.');
                    }}
                    className="text-xs"
                  >
                    🔍 Debug Voices
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">High Contrast Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Increase contrast for better visibility
                </p>
              </div>
              <Switch
                checked={settings.highContrastMode}
                onCheckedChange={(checked) => handleSettingChange('highContrastMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Large Text</h3>
                <p className="text-sm text-muted-foreground">
                  Increase text size for better readability
                </p>
              </div>
              <Switch
                checked={settings.largeText}
                onCheckedChange={(checked) => handleSettingChange('largeText', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Reduce Motion</h3>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                checked={settings.reduceMotion}
                onCheckedChange={(checked) => handleSettingChange('reduceMotion', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Sound Effects</h3>
                <p className="text-sm text-muted-foreground">
                  Enable audio feedback for interactions
                </p>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Haptic Feedback</h3>
                <p className="text-sm text-muted-foreground">
                  Enable vibration feedback on mobile
                </p>
              </div>
              <Switch
                checked={settings.hapticFeedback}
                onCheckedChange={(checked) => handleSettingChange('hapticFeedback', checked)}
              />
            </div>
            
            {!isSupported && (
              <p className="text-sm text-muted-foreground">
                Voice assistant is not supported in this browser
              </p>
            )}
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{t.darkMode}</h3>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Data Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button onClick={exportData} variant="outline" className="justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
              
              <Button 
                onClick={() => toast.info('Import feature coming soon')} 
                variant="outline" 
                className="justify-start"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
              
              <Button 
                onClick={() => {
                  if (confirm('Are you sure you want to reset all settings?')) {
                    localStorage.removeItem('appSettings');
                    localStorage.removeItem('workingHours');
                    toast.success('Settings reset successfully');
                    window.location.reload();
                  }
                }}
                variant="outline" 
                className="justify-start text-destructive hover:text-destructive"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset All Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Account Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={() => navigate(`/${userType}/profile`)}
                variant="outline"
                className="justify-start"
              >
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              
              <Button
                onClick={() => navigate('/payment')}
                variant="outline"
                className="justify-start"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Methods
              </Button>
              
              <Button
                onClick={() => navigate('/help')}
                variant="outline"
                className="justify-start"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </Button>
              
              <Button
                onClick={() => navigate('/feedback')}
                variant="outline"
                className="justify-start"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Feedback
              </Button>
              
              <Button
                onClick={() => {
                  if (confirm('Are you sure you want to logout?')) {
                    handleLogout();
                  }
                }}
                variant="destructive"
                className="justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h3 className="font-semibold mb-2">Zero Barrier</h3>
              <Badge variant="secondary" className="mb-2">Version 2.0.0</Badge>
              <p className="text-xs text-muted-foreground">
                Zero Barrier Employment Platform
              </p>
            </div>
            
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Build:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Environment:</span>
                <span>Production</span>
              </div>
              <div className="flex justify-between">
                <span>Device ID:</span>
                <span className="font-mono">EMP-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
              </div>
            </div>
            
            <div className="text-center mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Made with ❤️ for inclusive employment
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;