import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, User, Phone, Mail, Calendar, 
  CheckCircle, X, Clock, MessageSquare, Eye 
} from 'lucide-react';
import { toast } from 'sonner';

interface Application {
  id: string;
  applicantName: string;
  jobTitle: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'interviewed';
  phone?: string;
  email?: string;
  experience?: string;
  skills: string[];
}

const Applications = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();
  
  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      applicantName: 'Rajesh Kumar',
      jobTitle: 'Delivery Partner',
      appliedDate: '2 hours ago',
      status: 'pending',
      phone: '+91 9876543210',
      email: 'rajesh@example.com',
      experience: '2 years delivery experience',
      skills: ['Driving License', 'Own Vehicle', 'Local Area Knowledge'],
    },
    {
      id: '2',
      applicantName: 'Priya Sharma',
      jobTitle: 'Office Cleaner',
      appliedDate: '5 hours ago',
      status: 'pending',
      phone: '+91 9876543211',
      email: 'priya@example.com',
      experience: '3 years cleaning experience',
      skills: ['Housekeeping', 'Reliable', 'Punctual'],
    },
    {
      id: '3',
      applicantName: 'Mohammed Ali',
      jobTitle: 'Security Guard',
      appliedDate: '1 day ago',
      status: 'approved',
      phone: '+91 9876543212',
      email: 'mohammed@example.com',
      experience: '5 years security experience',
      skills: ['Security Training', 'Night Shifts', 'CCTV Monitoring'],
    },
    {
      id: '4',
      applicantName: 'Sunita Devi',
      jobTitle: 'Cook Assistant',
      appliedDate: '2 days ago',
      status: 'interviewed',
      phone: '+91 9876543213',
      email: 'sunita@example.com',
      experience: '4 years cooking experience',
      skills: ['Indian Cuisine', 'Food Safety', 'Team Work'],
    },
  ]);

  const handleStatusChange = (applicationId: string, newStatus: Application['status']) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus }
          : app
      )
    );

    const application = applications.find(app => app.id === applicationId);
    if (application) {
      const statusMessages = {
        approved: `Application approved for ${application.applicantName}`,
        rejected: `Application rejected for ${application.applicantName}`,
        interviewed: `Interview scheduled for ${application.applicantName}`,
      };
      
      toast.success(statusMessages[newStatus]);
      if (isSupported) speak(statusMessages[newStatus]);
    }
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'interviewed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      case 'interviewed': return <Calendar className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filterApplications = (status?: Application['status']) => {
    return status ? applications.filter(app => app.status === status) : applications;
  };

  const ApplicationCard = ({ application }: { application: Application }) => (
    <Card className="shadow-soft hover:shadow-medium transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{application.applicantName}</h3>
              <p className="text-muted-foreground">{application.jobTitle}</p>
            </div>
          </div>
          <Badge className={`${getStatusColor(application.status)} flex items-center space-x-1`}>
            {getStatusIcon(application.status)}
            <span className="capitalize">{application.status}</span>
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Applied {application.appliedDate}</span>
          </div>
          {application.phone && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{application.phone}</span>
            </div>
          )}
          {application.email && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{application.email}</span>
            </div>
          )}
        </div>

        {application.experience && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-1">Experience:</p>
            <p className="text-sm text-muted-foreground">{application.experience}</p>
          </div>
        )}

        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Skills:</p>
          <div className="flex flex-wrap gap-2">
            {application.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex space-x-2">
          {application.status === 'pending' && (
            <>
              <Button
                onClick={() => handleStatusChange(application.id, 'approved')}
                size="sm"
                className="flex-1 bg-success hover:bg-success/90"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={() => handleStatusChange(application.id, 'rejected')}
                size="sm"
                variant="destructive"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          
          {application.status === 'approved' && (
            <Button
              onClick={() => handleStatusChange(application.id, 'interviewed')}
              size="sm"
              className="flex-1"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
          )}

          <Button
            onClick={() => navigate('/company/messages')}
            size="sm"
            variant="outline"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-accent text-white p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={() => navigate('/company/dashboard')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t.viewApplications}</h1>
        </div>
        <p className="text-white/80">
          Review and manage job applications from workers
        </p>
      </div>

      <div className="px-6 -mt-4 pb-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-primary mb-1">
                {applications.length}
              </div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-warning mb-1">
                {filterApplications('pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-success mb-1">
                {filterApplications('approved').length}
              </div>
              <p className="text-xs text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-accent mb-1">
                {filterApplications('interviewed').length}
              </div>
              <p className="text-xs text-muted-foreground">Interviewed</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({filterApplications('pending').length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({filterApplications('approved').length})</TabsTrigger>
            <TabsTrigger value="interviewed">Interviewed ({filterApplications('interviewed').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {filterApplications('pending').map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4 mt-6">
            {filterApplications('approved').map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </TabsContent>

          <TabsContent value="interviewed" className="space-y-4 mt-6">
            {filterApplications('interviewed').map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </TabsContent>
        </Tabs>

        {applications.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-4">
                When workers apply for your jobs, their applications will appear here.
              </p>
              <Button onClick={() => navigate('/company/post-job')}>
                Post Your First Job
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Applications;