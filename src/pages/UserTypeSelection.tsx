import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, ArrowLeft } from 'lucide-react';

const UserTypeSelection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();

  const handleUserTypeSelect = (userType: 'worker' | 'company') => {
    if (isSupported) {
      const message = userType === 'worker' 
        ? `${t.worker} selected. ${t.workerDescription}`
        : `${t.company} selected. ${t.companyDescription}`;
      speak(message);
    }

    if (userType === 'worker') {
      navigate('/signup');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        {/* Header */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/language')}
            variant="ghost"
            size="sm"
            className="absolute top-6 left-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
            👥
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t.selectUserType}
          </h1>
        </div>

        {/* User type options */}
        <div className="space-y-6">
          <Card className="shadow-medium hover:shadow-strong transition-shadow cursor-pointer border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">{t.worker}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                {t.workerDescription}
              </p>
              <Button 
                onClick={() => handleUserTypeSelect('worker')}
                size="lg"
                className="w-full"
              >
                Continue as {t.worker}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-medium hover:shadow-strong transition-shadow cursor-pointer border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">{t.company}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                {t.companyDescription}
              </p>
              <Button 
                onClick={() => handleUserTypeSelect('company')}
                size="lg"
                className="w-full bg-accent hover:bg-accent-hover"
              >
                Continue as {t.company}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Login options */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {t.alreadyHaveAccount}
          </p>
          <div className="flex space-x-4">
            <Button 
              onClick={() => navigate('/login')}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              {t.login}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;