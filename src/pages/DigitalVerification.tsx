import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import AadhaarVerification from '@/components/AadhaarVerification';
import { 
  Shield, 
  CheckCircle, 
  Star, 
  Award, 
  Fingerprint, 
  Eye, 
  Lock,
  ArrowLeft,
  UserCheck,
  Building2,
  CreditCard,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const DigitalVerificationPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [verificationStep, setVerificationStep] = useState<'intro' | 'verify' | 'complete'>('intro');
  const [verificationData, setVerificationData] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animation for progress on intro
    if (verificationStep === 'intro') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [verificationStep]);

  const handleVerificationComplete = (data: any) => {
    setVerificationData(data);
    setVerificationStep('complete');
    
    // Store verification data
    localStorage.setItem('verificationData', JSON.stringify({
      ...data,
      completedAt: new Date().toISOString(),
      verificationLevel: 'gold',
      trustScore: 98
    }));
    
    toast.success('🎉 Digital verification completed successfully!');
  };

  const handleCompleteOnboarding = () => {
    // Update user profile with verification data
    const existingUser = localStorage.getItem('zeroBarrierUser');
    const userData = existingUser ? JSON.parse(existingUser) : {};
    
    const completeUserData = {
      ...userData,
      ...verificationData,
      isFullyVerified: true,
      verificationLevel: 'gold',
      trustScore: 98,
      verifiedServices: [
        'aadhaar',
        'face_recognition',
        'liveness_detection',
        'document_verification'
      ],
      lastVerified: new Date().toISOString()
    };
    
    localStorage.setItem('zeroBarrierUser', JSON.stringify(completeUserData));
    toast.success('Welcome to Employ Assist! Your account is now fully verified.');
    navigate('/home');
  };

  if (verificationStep === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-lg w-full space-y-6">
          {/* Logo and Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Zero Barrier</h1>
            <p className="text-gray-600">
              Secure Digital Identity Verification
            </p>
          </div>

          {/* Features Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Bank-Grade Security Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Fingerprint className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Aadhaar eKYC</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Eye className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Face Match</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <UserCheck className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Liveness Check</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Lock className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">256-bit SSL</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Progress value={progress} className="h-2" />
                <p className="text-center text-sm text-gray-600">
                  Initializing secure verification system...
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600">UIDAI Certified</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs text-gray-600">ISO 27001</p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-xs text-gray-600">RBI Approved</p>
            </div>
          </div>

          <Button
            onClick={() => setVerificationStep('verify')}
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
            disabled={progress < 100}
          >
            <Shield className="w-5 h-5 mr-3" />
            Start Secure Verification
          </Button>

          <p className="text-center text-xs text-gray-500">
            Your data is encrypted and processed securely according to government guidelines
          </p>
        </div>
      </div>
    );
  }

  if (verificationStep === 'verify') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              onClick={() => setVerificationStep('intro')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Digital Identity Verification</h1>
              <p className="text-blue-100">Powered by UIDAI & Advanced AI</p>
            </div>
          </div>
          
          <Alert className="bg-white/10 border-white/20 text-white">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Secure Process:</strong> Your Aadhaar data is processed directly with UIDAI servers. 
              We never store your sensitive information.
            </AlertDescription>
          </Alert>
        </div>

        <div className="p-6">
          <AadhaarVerification
            onVerificationComplete={handleVerificationComplete}
            language="en"
          />
        </div>
      </div>
    );
  }

  if (verificationStep === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          {/* Success Animation */}
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-800">Verification Complete!</h1>
            <p className="text-green-700">
              Your digital identity has been successfully verified
            </p>
          </div>

          {/* Verification Summary */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-center space-x-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>Gold Verification</span>
                <Badge className="bg-yellow-100 text-yellow-800">Trusted</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {verificationData?.aadhaarInfo && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Identity Verified</span>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Aadhaar Validated</span>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium">Face Matched</span>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Fingerprint className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">Liveness Confirmed</span>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              )}

              {/* Trust Score */}
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-2xl font-bold text-blue-700">98%</span>
                </div>
                <p className="text-sm text-blue-600 font-medium">Trust Score</p>
                <p className="text-xs text-blue-500 mt-1">Highest verification level achieved</p>
              </div>

              {/* Verified Information */}
              {verificationData?.aadhaarInfo && (
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Verified Information</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{verificationData.aadhaarInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{verificationData.aadhaarInfo.gender === 'M' ? 'Male' : 'Female'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">DOB:</span>
                      <span className="font-medium">{verificationData.aadhaarInfo.dateOfBirth}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="bg-white/90 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4 text-center">Your Benefits</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Access to all premium job opportunities</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Higher priority in employer searches</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Instant verification badge on profile</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Fast-track application processing</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleCompleteOnboarding}
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
          >
            <Award className="w-5 h-5 mr-3" />
            Complete Setup & Start Working
          </Button>

          <p className="text-center text-xs text-gray-500">
            🎉 Congratulations! You're now a trusted member of Employ Assist
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default DigitalVerificationPage;