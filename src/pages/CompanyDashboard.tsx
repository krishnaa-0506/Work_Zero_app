import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Plus, Users, FileText, MessageSquare, 
  Bell, Settings, Eye, TrendingUp, Calendar, MapPin 
} from 'lucide-react';

interface CompanyStats {
  activeJobs: number;
  totalApplications: number;
  newApplications: number;
  scheduledInterviews: number;
}

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();
  const [stats, setStats] = useState<CompanyStats>({
    activeJobs: 5,
    totalApplications: 23,
    newApplications: 7,
    scheduledInterviews: 3,
  });

  const recentJobs = [
    {
      id: '1',
      title: 'Delivery Partner',
      applications: 8,
      status: 'Active',
      postedDate: '2 days ago',
      location: 'Bangalore',
    },
    {
      id: '2',
      title: 'Office Cleaner',
      applications: 5,
      status: 'Active',
      postedDate: '1 week ago',
      location: 'Mumbai',
    },
    {
      id: '3',
      title: 'Security Guard',
      applications: 10,
      status: 'Paused',
      postedDate: '3 days ago',
      location: 'Delhi',
    },
  ];

  useEffect(() => {
    // Welcome message
    if (isSupported) {
      setTimeout(() => {
        speak(`Welcome to your company dashboard. You have ${stats.activeJobs} active jobs and ${stats.newApplications} new applications.`);
      }, 1000);
    }
  }, [speak, isSupported, stats]);

  const handleQuickAction = (action: string) => {
    if (isSupported) {
      speak(`Opening ${action}`);
    }
    
    switch (action) {
      case 'post-job':
        navigate('/company/post-job');
        break;
      case 'applications':
        navigate('/company/applications');
        break;
      case 'messages':
        navigate('/company/messages');
        break;
      case 'notifications':
        navigate('/company/notifications');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-accent text-white p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">{t.dashboard}</h1>
            <p className="text-white/80">Manage your jobs and applications</p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => navigate('/company/notifications')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 relative"
            >
              <Bell className="w-5 h-5" />
              {stats.newApplications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-primary">
                  {stats.newApplications}
                </Badge>
              )}
            </Button>
            <Button
              onClick={() => navigate('/company/profile')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Building2 className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => navigate('/company/settings')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => handleQuickAction('post-job')}
            variant="secondary"
            size="lg"
            className="h-16 flex-col space-y-2"
          >
            <Plus className="w-6 h-6" />
            <span>{t.postJob}</span>
          </Button>
          <Button
            onClick={() => handleQuickAction('applications')}
            variant="secondary"
            size="lg"
            className="h-16 flex-col space-y-2"
          >
            <FileText className="w-6 h-6" />
            <span>{t.viewApplications}</span>
          </Button>
        </div>
      </div>

      <div className="px-6 -mt-4 pb-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">
                {stats.activeJobs}
              </div>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {stats.totalApplications}
              </div>
              <p className="text-sm text-muted-foreground">Total Applications</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success mb-1">
                {stats.newApplications}
              </div>
              <p className="text-sm text-muted-foreground">New Applications</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning mb-1">
                {stats.scheduledInterviews}
              </div>
              <p className="text-sm text-muted-foreground">Interviews Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Jobs */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Job Posts
              <Button
                onClick={() => navigate('/company/post-job')}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Job
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground mb-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{job.postedDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{job.applications} applications</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={job.status === 'Active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {job.status}
                    </Badge>
                    <Button
                      onClick={() => navigate('/company/applications')}
                      size="sm"
                      variant="ghost"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="shadow-soft cursor-pointer hover:shadow-medium transition-shadow"
            onClick={() => handleQuickAction('applications')}
          >
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t.viewApplications}</h3>
              <p className="text-sm text-muted-foreground">
                Review and manage job applications
              </p>
            </CardContent>
          </Card>

          <Card 
            className="shadow-soft cursor-pointer hover:shadow-medium transition-shadow"
            onClick={() => handleQuickAction('messages')}
          >
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t.messages}</h3>
              <p className="text-sm text-muted-foreground">
                Chat with potential candidates
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;