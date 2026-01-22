import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import WebcamCapture from './WebcamCapture';
import { 
  Shield, 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Eye,
  Scan,
  UserCheck,
  FileImage
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  validateAadhaarNumber, 
  sendOTP as sendAadhaarOTP, 
  verifyOTP as verifyAadhaarOTP, 
  verifyFaces,
  verifyAadhaarWithUIDAI,
  AadhaarVerificationResult,
  FaceVerificationResult 
} from '@/utils/faceVerification';

interface AadhaarVerificationProps {
  onVerificationComplete: (data: any) => void;
  language: string;
}

const AadhaarVerification = ({ onVerificationComplete, language }: AadhaarVerificationProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [verificationData, setVerificationData] = useState({
    aadhaarNumber: '',
    otp: '',
    txnId: '',
    aadhaarInfo: null as AadhaarVerificationResult['data'] | null,
    aadhaarPhoto: null as File | null,
    selfieImage: '',
    verificationResult: null as FaceVerificationResult | null
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAadhaarSubmit = async () => {
    const cleanNumber = verificationData.aadhaarNumber.replace(/\s/g, '');
    if (cleanNumber.length !== 12 || !/^\d{12}$/.test(cleanNumber)) {
      toast.error('🔢 Please enter exactly 12 digits for your Aadhaar number');
      return;
    }

    setLoading(true);
    setProgress(10);

    try {
      // Step 1: Verify Aadhaar with UIDAI
      const aadhaarResult = await verifyAadhaarWithUIDAI(verificationData.aadhaarNumber);
      setProgress(40);

      if (!aadhaarResult.success) {
        toast.error(aadhaarResult.error || 'Aadhaar verification failed');
        setLoading(false);
        return;
      }

      setVerificationData(prev => ({
        ...prev,
        aadhaarInfo: aadhaarResult.data!
      }));

      setProgress(60);

      // Step 2: Send OTP
      const otpResult = await sendAadhaarOTP(verificationData.aadhaarNumber);
      setProgress(80);

      if (!otpResult.success) {
        toast.error(otpResult.message);
        setLoading(false);
        return;
      }

      setVerificationData(prev => ({
        ...prev,
        txnId: otpResult.txnId
      }));

      setProgress(100);
      toast.success(`OTP sent successfully! ${otpResult.otp ? `Demo OTP: ${otpResult.otp}` : ''}`);
      
      // Auto-fill OTP in demo mode
      if (otpResult.otp) {
        setTimeout(() => {
          setVerificationData(prev => ({ ...prev, otp: otpResult.otp! }));
        }, 1000);
      }

      setStep(2);
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (verificationData.otp.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setProgress(20);

    try {
      const isValid = await verifyAadhaarOTP(verificationData.otp, verificationData.txnId);
      setProgress(100);

      if (isValid) {
        toast.success('OTP verified successfully!');
        setStep(3);
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      setVerificationData(prev => ({
        ...prev,
        aadhaarPhoto: file
      }));
      
      toast.success('Aadhaar photo uploaded successfully');
    }
  };

  const handleSelfieCapture = async (imageSrc: string) => {
    if (!verificationData.aadhaarPhoto) {
      toast.error('Please upload your Aadhaar photo first');
      return;
    }

    setLoading(true);
    setProgress(10);

    try {
      setVerificationData(prev => ({
        ...prev,
        selfieImage: imageSrc
      }));

      setProgress(30);
      toast.info('Performing advanced face verification...');

      // Perform comprehensive face verification
      const result = await verifyFaces(verificationData.aadhaarPhoto, imageSrc);
      setProgress(100);

      setVerificationData(prev => ({
        ...prev,
        verificationResult: result
      }));

      if (result.isMatch) {
        toast.success(`Face verification successful! Confidence: ${result.confidence.toFixed(1)}%`);
        
        // Complete verification process
        const completeData = {
          aadhaarNumber: verificationData.aadhaarNumber,
          aadhaarInfo: verificationData.aadhaarInfo,
          faceVerified: true,
          verificationResult: result,
          verifiedAt: new Date().toISOString()
        };

        onVerificationComplete(completeData);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Face verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatAadhaarNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 12);
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3').trim();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Aadhaar Verification</CardTitle>
              <p className="text-muted-foreground">
                Secure verification using UIDAI services
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="aadhaar" className="text-base font-medium">
                  Aadhaar Number
                </Label>
                <Input
                  id="aadhaar"
                  value={verificationData.aadhaarNumber}
                  onChange={(e) => setVerificationData(prev => ({
                    ...prev,
                    aadhaarNumber: formatAadhaarNumber(e.target.value)
                  }))}
                  placeholder="1234 5678 9012"
                  className="h-12 text-lg text-center tracking-wider"
                  maxLength={14}
                />
                <p className="text-xs text-muted-foreground text-center">
                  Your Aadhaar number is encrypted and secure
                </p>
              </div>

              {loading && (
                <div className="space-y-3">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    Verifying with UIDAI servers...
                  </p>
                </div>
              )}

              <Button
                onClick={handleAadhaarSubmit}
                disabled={loading || verificationData.aadhaarNumber.replace(/\s/g, '').length !== 12}
                className="w-full h-12 text-base"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Verify Aadhaar
                  </>
                )}
              </Button>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  We use bank-grade security to protect your information. 
                  Your Aadhaar data is processed securely through UIDAI services.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">OTP Verification</CardTitle>
              <p className="text-muted-foreground">
                Enter the OTP sent to your registered mobile number
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {verificationData.aadhaarInfo && (
                <Alert>
                  <UserCheck className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Verified:</strong> {verificationData.aadhaarInfo.name}
                    <br />
                    <small>DOB: {verificationData.aadhaarInfo.dateOfBirth}</small>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <Label className="text-base font-medium text-center block">
                  📱 Enter 6-digit OTP
                </Label>
                <div className="text-center mb-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    💡 Demo: Use OTP "123456"
                  </Badge>
                </div>
                <div className="flex justify-center">
                  <InputOTP
                    value={verificationData.otp}
                    onChange={(value) => setVerificationData(prev => ({
                      ...prev,
                      otp: value
                    }))}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {loading && (
                <div className="space-y-3">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    Verifying OTP...
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button
                  onClick={handleOTPVerification}
                  disabled={loading || verificationData.otp.length !== 6}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Verify OTP
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleAadhaarSubmit()}
                  variant="outline"
                  disabled={loading}
                  className="w-full"
                >
                  Resend OTP
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <Scan className="w-10 h-10 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Face Verification</CardTitle>
              <p className="text-muted-foreground">
                Upload your Aadhaar photo and take a live selfie for verification
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Aadhaar Photo Upload */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  1. Upload clear photo from your Aadhaar card
                </Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="mb-3"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {verificationData.aadhaarPhoto ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  
                  {verificationData.aadhaarPhoto && (
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <FileImage className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {verificationData.aadhaarPhoto.name}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG up to 5MB. Ensure face is clearly visible.
                  </p>
                </div>
              </div>

              {/* Live Selfie */}
              {verificationData.aadhaarPhoto && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    2. Take a live selfie for face matching
                  </Label>
                  <div className="border rounded-lg overflow-hidden">
                    <WebcamCapture
                      onCapture={handleSelfieCapture}
                      showInstructions={true}
                    />
                  </div>
                  
                  <Alert>
                    <Eye className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Instructions:</strong>
                      <ul className="mt-2 text-sm space-y-1">
                        <li>• Ensure good lighting on your face</li>
                        <li>• Look directly at the camera</li>
                        <li>• Remove glasses if possible</li>
                        <li>• Keep a neutral expression</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {loading && (
                <div className="space-y-3">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-center text-muted-foreground">
                    Performing advanced face verification...
                  </p>
                </div>
              )}

              {/* Verification Result */}
              {verificationData.verificationResult && (
                <Alert className={verificationData.verificationResult.isMatch ? "border-green-500" : "border-red-500"}>
                  {verificationData.verificationResult.isMatch ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">
                        {verificationData.verificationResult.message}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="font-medium">Confidence:</span>{' '}
                          {verificationData.verificationResult.confidence.toFixed(1)}%
                        </div>
                        <div>
                          <span className="font-medium">Quality:</span>{' '}
                          {verificationData.verificationResult.quality.toFixed(1)}%
                        </div>
                        <div>
                          <span className="font-medium">Liveness:</span>{' '}
                          {verificationData.verificationResult.liveness ? 'Passed' : 'Failed'}
                        </div>
                        <div>
                          <Badge variant={verificationData.verificationResult.isMatch ? "default" : "destructive"}>
                            {verificationData.verificationResult.isMatch ? 'Verified' : 'Failed'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                stepNumber === step
                  ? 'bg-primary text-primary-foreground'
                  : stepNumber < step
                  ? 'bg-green-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {stepNumber < step ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                stepNumber
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Aadhaar</span>
          <span>OTP</span>
          <span>Face Match</span>
        </div>
      </div>

      {renderStep()}
    </div>
  );
};

export default AadhaarVerification;