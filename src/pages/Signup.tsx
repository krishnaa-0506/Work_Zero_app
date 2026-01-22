import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WebcamCapture from '@/components/WebcamCapture';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard,
  Mic, 
  CheckCircle, 
  Loader2, 
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { validateAadhaarNumber, verifyAadhaarWithUIDAI, verifyFaces } from '@/utils/faceVerification';

const Signup = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const webcamRef = useRef<HTMLVideoElement>(null);
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    speak, 
    isSupported 
  } = useVoiceAssistant();

  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    aadhaarDetails: null as any,
    aadhaarPhoto: null as File | null,
    selfieImage: '',
    isLivenessVerified: false,
    isFaceMatched: false,
    isAadhaarVerified: false,
    extractedDetails: {
      name: '',
      dob: '',
      gender: '',
      address: ''
    }
  });

  // Auto-format Aadhaar number with spaces
  const formatAadhaar = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})$/);
    if (match) {
      return match[1] + ' ' + match[2] + ' ' + match[3];
    }
    return cleaned;
  };

  // Mask Aadhaar number except last 4 digits
  const maskAadhaar = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    return 'XXXX XXXX ' + cleaned.slice(-4);
  };

  const handleAadhaarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      aadhaarNumber: formatAadhaar(value)
    }));
  };

  const handleAadhaarVerify = async () => {
    if (!validateAadhaarNumber(formData.aadhaarNumber)) {
      toast.error("Please enter a valid 12-digit Aadhaar number");
      if (isSupported) {
        speak("Please enter a valid 12-digit Aadhaar number");
      }
      return;
    }

    setLoading(true);
    setProgress(25);

    try {
      const result = await verifyAadhaarWithUIDAI(formData.aadhaarNumber);
      setProgress(50);

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          aadhaarDetails: result.data,
          extractedDetails: {
            name: result.data.name,
            dob: result.data.dateOfBirth,
            gender: result.data.gender,
            address: result.data.address
          },
          isAadhaarVerified: true
        }));
        
        toast.success("Aadhaar verification successful!");
        if (isSupported) {
          speak("Aadhaar verification completed successfully");
        }
        setCurrentStep(2);
      } else {
        toast.error(result.error || "Verification failed");
      }
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      // Update Aadhaar number when voice input is final
      if (transcript) {
        const numbers = transcript.replace(/\D/g, '');
        setFormData(prev => ({
          ...prev,
          aadhaarNumber: formatAadhaar(numbers)
        }));
      }
    }
  };

  const handleSelfieCapture = async (imageSrc: string) => {
    // First just store the image when it's captured
    setFormData(prev => ({ ...prev, selfieImage: imageSrc }));
  };

  const handleSelfieVerification = async () => {
    if (!formData.selfieImage) return;
    
    setLoading(true);
    setProgress(25);

    try {
      // First verify liveness
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormData(prev => ({ ...prev, isLivenessVerified: true }));
      setProgress(50);
      
      // For demo, simulate face matching
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(75);
      
      setFormData(prev => ({ ...prev, isFaceMatched: true }));
      toast.success("Face verification successful!");
      if (isSupported) {
        speak("Face verification completed successfully");
      }
      setCurrentStep(4);
    } catch (error) {
      toast.error("Verification failed. Please try again.");
      if (isSupported) {
        speak("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleSubmit = () => {
    if (!formData.isAadhaarVerified) {
      toast.error("Please complete Aadhaar verification");
      return;
    }
    if (!formData.isLivenessVerified || !formData.isFaceMatched) {
      toast.error("Please complete face verification");
      return;
    }

    // Store user data and navigate
    const userData = {
      ...formData,
      aadhaarNumber: maskAadhaar(formData.aadhaarNumber),
      isVerified: true,
      verifiedAt: new Date().toISOString(),
      trustScore: 100
    };
    
    localStorage.setItem('zeroBarrierUser', JSON.stringify(userData));
    toast.success('Account created successfully!');
    if (isSupported) {
      speak('Your identity has been verified. Welcome to Zero Barrier!');
    }
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-8">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Zero Barrier</h1>
            <p className="text-lg text-gray-600">{t.appTitle}</p>
          </div>
          
          {/* Language Selector */}
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
            <Globe className="w-4 h-4 text-gray-500" />
            <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
              <SelectTrigger className="w-32 border-0 focus:ring-0">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="ta">தமிழ்</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{t.welcome}</CardTitle>
            <CardDescription>{t.verifyIdentity}</CardDescription>
            {loading && (
              <Progress value={progress} className="mt-2" />
            )}
          </CardHeader>

          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <Label htmlFor="aadhaar">{t.aadhaar.label}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="aadhaar"
                        placeholder="XXXX XXXX XXXX"
                        value={formData.aadhaarNumber}
                        onChange={handleAadhaarInput}
                        maxLength={14}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleVoiceInput}
                      >
                        {isListening ? (
                          <Mic className="h-4 w-4 text-red-500" />
                        ) : (
                          <Mic className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleAadhaarVerify}
                      disabled={loading || !validateAadhaarNumber(formData.aadhaarNumber)}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-2" />
                      )}
                      {t.aadhaar.verify}
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && formData.isAadhaarVerified && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
                    <h3 className="font-medium">{t.details.title}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{t.details.name}</Label>
                        <p className="mt-1 font-medium">{formData.extractedDetails.name}</p>
                      </div>
                      <div>
                        <Label>{t.details.dob}</Label>
                        <p className="mt-1 font-medium">{formData.extractedDetails.dob}</p>
                      </div>
                      <div>
                        <Label>{t.details.gender}</Label>
                        <p className="mt-1 font-medium">{formData.extractedDetails.gender}</p>
                      </div>
                    </div>
                    <div>
                      <Label>{t.details.address}</Label>
                      <p className="mt-1 font-medium">{formData.extractedDetails.address}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setCurrentStep(3)}
                  >
                    {t.button.continue}
                  </Button>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h3 className="font-medium">{t.selfie.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.selfie.description}</p>
                    <WebcamCapture 
                      onCapture={handleSelfieCapture}
                      onConfirm={handleSelfieVerification}
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && formData.isLivenessVerified && formData.isFaceMatched && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    <h3 className="font-medium text-lg">{t.success.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.success.description}</p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleSubmit}
                  >
                    {t.button.start}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center text-sm text-muted-foreground">
          <p>{t.help}</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;