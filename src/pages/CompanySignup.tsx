import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const CompanySignup = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companySize: '',
    industry: '',
    website: '',
    description: '',
    contactPerson: '',
    phone: '',
  });

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Construction', 'Transportation', 'Hospitality', 'Other'
  ];

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees', 
    '201-500 employees', '501-1000 employees', '1000+ employees'
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!formData.companyName || !formData.email || !formData.password) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      setStep(2);
    } else {
      handleSignup();
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      localStorage.setItem('companyData', JSON.stringify(formData));
      localStorage.setItem('userType', 'company');
      localStorage.setItem('isLoggedIn', 'true');
      
      toast.success("Company account created successfully!");
      if (isSupported) speak("Company account created successfully! Welcome to Zero Barrier.");
      
      navigate('/company/dashboard');
      setLoading(false);
    }, 2000);
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-center">Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">{t.companyName} *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Enter company name"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t.email} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="company@example.com"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t.password} *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Create a strong password"
                    className="h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm your password"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  placeholder="HR Manager / Recruiter name"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 9876543210"
                  className="h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="text-center">Company Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t.companySize}</Label>
              <Select value={formData.companySize} onValueChange={(value) => setFormData(prev => ({ ...prev, companySize: value }))}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t.industry}</Label>
              <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">{t.website}</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://company.com"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t.description}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your company..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            onClick={() => step === 1 ? navigate('/user-type') : setStep(1)}
            variant="ghost"
            size="sm"
            className="absolute top-6 left-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="w-16 h-16 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
            <Building2 className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t.company} Signup
          </h1>
          <p className="text-muted-foreground">
            Create your company account to start hiring
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i <= step
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {i}
              </div>
            ))}
          </div>
          <div className="w-full bg-muted h-2 rounded-full">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="animate-slide-up mb-8">
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => step === 1 ? navigate('/user-type') : setStep(1)}
            variant="outline"
            size="lg"
          >
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={loading}
            size="lg"
            className="px-8 bg-accent hover:bg-accent-hover"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              step === 2 ? 'Create Account' : t.next
            )}
          </Button>
        </div>

        {/* Login link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {t.alreadyHaveAccount}
          </p>
          <Button
            onClick={() => navigate('/company/login')}
            variant="link"
            size="sm"
          >
            {t.company} {t.login}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanySignup;