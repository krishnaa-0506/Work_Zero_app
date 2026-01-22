import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  CheckCircle, 
  Star, 
  Award, 
  Fingerprint, 
  Eye, 
  Lock,
  ArrowRight,
  Users,
  Building2,
  CreditCard,
  Smartphone
} from 'lucide-react';

const VerificationDemo = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Fingerprint className="w-6 h-6 text-blue-600" />,
      title: "Aadhaar eKYC",
      description: "Real-time UIDAI verification with OTP validation",
      status: "Government Approved"
    },
    {
      icon: <Eye className="w-6 h-6 text-green-600" />,
      title: "Advanced Face Match",
      description: "Multi-algorithm face recognition with 99.7% accuracy",
      status: "AI Powered"
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: "Liveness Detection",
      description: "Anti-spoofing technology to prevent fraud",
      status: "Bank Grade"
    },
    {
      icon: <Lock className="w-6 h-6 text-orange-600" />,
      title: "256-bit Encryption",
      description: "End-to-end encrypted data processing",
      status: "Military Grade"
    }
  ];

  const benefits = [
    "Access to all premium job opportunities",
    "Higher priority in employer searches", 
    "Instant verification badge on profile",
    "Fast-track application processing",
    "2x higher earning potential",
    "Government-grade security standards"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Digital Verification System</h1>
              <p className="text-blue-100">DigiLocker-grade security for employment platform</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold">99.7%</div>
              <div className="text-blue-100 text-sm">Accuracy Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">2M+</div>
              <div className="text-blue-100 text-sm">Verified Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-blue-100 text-sm">Government Compliant</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Verification Process */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-center">3-Step Verification Process</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Step 1</h3>
                  <p className="text-sm text-gray-600">Enter Aadhaar number and verify with OTP</p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Step 2</h3>
                  <p className="text-sm text-gray-600">Capture live selfie with liveness detection</p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Step 3</h3>
                  <p className="text-sm text-gray-600">AI matches your face with Aadhaar photo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
              <Award className="w-6 h-6 text-yellow-500" />
              <span>Gold Verification Benefits</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">UIDAI Certified</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">ISO 27001</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">RBI Approved</p>
          </div>
          
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-600">2M+ Verified</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Ready to Get Verified?</h2>
            <p className="text-gray-600">
              Join thousands of trusted workers earning more with Gold verification
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/worker/signup')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 px-8"
            >
              <Shield className="w-5 h-5 mr-2" />
              Start New Account Verification
            </Button>
            
            <Button
              onClick={() => navigate('/worker/digital-verification')}
              size="lg"
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8"
            >
              <Award className="w-5 h-5 mr-2" />
              Upgrade Existing Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-500">
            🔒 Your data is encrypted and processed securely according to government guidelines
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationDemo;