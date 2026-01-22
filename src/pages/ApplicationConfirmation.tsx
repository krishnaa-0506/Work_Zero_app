import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Home, Eye } from 'lucide-react';

const ApplicationConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();

  const { jobTitle, company } = location.state || { 
    jobTitle: 'this position', 
    company: 'the company' 
  };

  useEffect(() => {
    // Announce successful application
    if (isSupported) {
      const message = `Application submitted successfully for ${jobTitle} at ${company}. You will be contacted soon.`;
      speak(message, { rate: 0.8 });
    }
  }, [speak, isSupported, jobTitle, company]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Success animation */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center animate-pulse-slow">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
        </div>

        {/* Success message */}
        <Card className="shadow-medium border-success/20">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-card-foreground mb-4">
              {t.applicationSent}
            </h1>
            
            <div className="space-y-2 mb-6">
              <p className="text-lg font-medium text-primary">
                {jobTitle}
              </p>
              <p className="text-muted-foreground">
                at {company}
              </p>
            </div>

            <div className="bg-success-light rounded-lg p-4 mb-6">
              <p className="text-sm text-success font-medium">
                Your application has been submitted successfully. 
                The employer will contact you within 24-48 hours.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                What happens next:
              </p>
              <ul className="text-left space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Employer reviews your application</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>You'll receive a call or message</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Interview or direct hiring</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/notifications')}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Eye className="w-5 h-5 mr-2" />
            {t.trackApplication}
          </Button>
          
          <Button 
            onClick={() => navigate('/home')}
            size="lg"
            className="w-full bg-primary hover:bg-primary-hover"
          >
            <Home className="w-5 h-5 mr-2" />
            {t.goHome}
          </Button>
        </div>

        {/* Motivational message */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Keep looking for more opportunities! 
            Your next great job is just a tap away.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationConfirmation;