import { ArrowLeft, Building2, Calendar, Clock, MapPin, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  nextStep?: string;
  interviewDate?: string;
}

const MyApplications = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();

  const applications: JobApplication[] = [
    {
      id: '1',
      jobTitle: 'Construction Helper',
      company: 'BuildCorp India',
      location: 'Koramangala, Bangalore',
      appliedDate: '2025-09-25',
      status: 'interview',
      nextStep: 'Interview scheduled',
      interviewDate: '2025-09-27'
    },
    {
      id: '2',
      jobTitle: 'Delivery Partner',
      company: 'QuickEats',
      location: 'HSR Layout, Bangalore',
      appliedDate: '2025-09-24',
      status: 'reviewing',
      nextStep: 'Application under review'
    }
  ];

  const getStatusColor = (status: JobApplication['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      interview: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getStatusProgress = (status: JobApplication['status']) => {
    const progress = {
      pending: 25,
      reviewing: 50,
      interview: 75,
      accepted: 100,
      rejected: 100
    };
    return progress[status];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={() => navigate('/home')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t.myApplications}</h1>
        </div>
        <p className="text-white/90">{t.trackApplications}</p>
      </div>

      {/* Applications List */}
      <div className="p-4 space-y-4">
        {applications.map((application) => (
          <Card key={application.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {application.jobTitle}
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {application.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {application.location}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(application.status)}>
                  {t[application.status as keyof typeof t] || application.status}
                </Badge>
              </div>

              <Progress value={getStatusProgress(application.status)} className="mb-4" />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {t.applied} {new Date(application.appliedDate).toLocaleDateString()}
                  </div>
                  {application.interviewDate && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Interview on {new Date(application.interviewDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/messages')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {applications.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold mb-2">{t.noApplicationsYet}</h3>
            <p className="text-muted-foreground mb-4">
              {t.startApplying}
            </p>
            <Button
              onClick={() => navigate('/home')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t.browseJobs}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
