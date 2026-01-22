import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Building2, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const CompanyLogin = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      if (isSupported) speak("Please fill in all fields");
      return;
    }

    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      // In a real app, you would validate credentials with your backend
      localStorage.setItem('userType', 'company');
      localStorage.setItem('isLoggedIn', 'true');
      
      toast.success("Login successful!");
      if (isSupported) speak("Login successful! Welcome back to your company dashboard.");
      
      navigate('/company/dashboard');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        {/* Header */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/user-type')}
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
            {t.company} {t.login}
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Access your company dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-center">{t.login}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
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
                <Label htmlFor="password">{t.password}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    className="h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleLogin}
                disabled={loading}
                size="lg"
                className="w-full bg-accent hover:bg-accent-hover"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  t.login
                )}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => toast.info("Password reset feature coming soon!")}
                >
                  {t.forgotPassword}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {t.dontHaveAccount}
          </p>
          <Button
            onClick={() => navigate('/company/signup')}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Create {t.company} Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;