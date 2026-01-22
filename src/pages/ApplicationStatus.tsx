import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, Clock, Building2, MessageSquare } from 'lucide-react';

interface ApplicationState {
  company: string;
  jobTitle: string;
  notification?: {
    type: string;
    title: string;
    message: string;
    time: string;
  };
}

const ApplicationStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { company, jobTitle, notification } = location.state as ApplicationState;

  // This would typically come from your API
  const applicationSteps = [
    {
      id: 1,
      title: t.applicationSubmitted || 'Application Submitted',
      description: t.applicationSubmittedDesc || 'Your application has been received',
      status: 'completed',
      date: '2025-09-23',
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      id: 2,
      title: t.applicationReview || 'Application Review',
      description: t.applicationReviewDesc || 'Recruiter is reviewing your profile',
      status: 'current',
      date: '2025-09-24',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: 3,
      title: t.interviewScheduling || 'Interview Scheduling',
      description: t.interviewSchedulingDesc || 'Waiting for interview schedule',
      status: 'pending',
      date: null,
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: 4,
      title: t.finalDecision || 'Final Decision',
      description: t.finalDecisionDesc || 'Awaiting final decision',
      status: 'pending',
      date: null,
      icon: <MessageSquare className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t.applicationStatus || 'Application Status'}</h1>
            <p className="text-white/80">{jobTitle} - {company}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Timeline */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {applicationSteps.map((step, index) => (
                <div key={step.id} className="flex gap-4">
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div className={`rounded-full p-2 ${
                      step.status === 'completed' ? 'bg-success text-white' :
                      step.status === 'current' ? 'bg-primary text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {step.icon}
                    </div>
                    {index < applicationSteps.length - 1 && (
                      <div className={`w-0.5 h-full mt-2 ${
                        step.status === 'completed' ? 'bg-success' :
                        'bg-muted'
                      }`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <h3 className={`font-semibold ${
                      step.status === 'completed' ? 'text-success' :
                      step.status === 'current' ? 'text-primary' :
                      'text-muted-foreground'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                    {step.date && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(step.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-6 space-y-4">
          <Button 
            className="w-full"
            onClick={() => navigate('/messages', { 
              state: { company, jobTitle } 
            })}
          >
            {t.contactRecruiter || 'Contact Recruiter'}
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/feedback', { 
              state: { company, jobTitle } 
            })}
          >
            {t.viewFeedback || 'View Feedback'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;
