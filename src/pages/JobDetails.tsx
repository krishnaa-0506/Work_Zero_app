import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { sampleJobs } from '@/data/sampleJobs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Clock, CheckCircle, DollarSign, Volume2 } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();

  const job = sampleJobs.find(j => j.id === id);

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <Button onClick={() => navigate('/home')}>Go Back</Button>
        </div>
      </div>
    );
  }

  const formatSalary = () => {
    const currency = language === 'hi' || language === 'ta' ? '₹' : '₹';
    const amount = job.salary.amount.toLocaleString();
    const period = job.salary.period === 'month' ? t.perMonth : t.perDay;
    return `${currency}${amount}${period}`;
  };

  const handleApply = () => {
    if (isSupported) {
      speak(`Applying for ${job.title} position`, { rate: 0.9 });
    }
    
    navigate('/application-sent', { 
      state: { 
        jobTitle: job.title, 
        company: job.company 
      } 
    });
  };

  const readJobDetails = () => {
    if (isSupported) {
      const details = `
        ${job.title} at ${job.company}. 
        Salary: ${formatSalary()}. 
        Location: ${job.distance} kilometers away. 
        Working hours: ${job.workingHours}. 
        Description: ${job.description}
      `;
      speak(details, { rate: 0.8 });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={() => navigate('/home')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Job Details</h1>
        </div>
        
        {isSupported && (
          <Button
            onClick={readJobDetails}
            variant="secondary"
            size="sm"
            className="mb-4"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Read Details
          </Button>
        )}
      </div>

      <div className="px-6 -mt-4 pb-6">
        {/* Job overview card */}
        <Card className="shadow-medium mb-6">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4 mb-6">
              <div className="text-4xl">{job.icon}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-card-foreground mb-2">
                  {job.title}
                </h2>
                <div className="flex items-center space-x-2 mb-2">
                  <p className="text-lg text-muted-foreground">{job.company}</p>
                  {job.isVerified && (
                    <Badge variant="secondary" className="bg-success-light text-success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {t.companyVerified}
                    </Badge>
                  )}
                </div>
                <Badge variant="outline" className="text-sm">
                  {t[job.category as keyof typeof t] as string}
                </Badge>
              </div>
            </div>

            {/* Quick info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Salary</p>
                  <p className="font-semibold text-primary">{formatSalary()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="font-semibold">{job.distance} {t.kmAway}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Working Hours</p>
                <p className="font-semibold">{job.workingHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job description */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {job.description}
            </p>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="shadow-medium mb-8">
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <p className="text-muted-foreground">{job.location}</p>
            </div>
          </CardContent>
        </Card>

        {/* Apply button */}
        <div className="sticky bottom-6">
          <Button 
            onClick={handleApply}
            size="lg"
            className="w-full h-14 text-lg bg-accent hover:bg-accent-hover shadow-strong"
          >
            {t.applyNow}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;