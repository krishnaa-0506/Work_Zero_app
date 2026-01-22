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
import { ArrowLeft, Plus, Loader2, MapPin, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const JobPosting = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    requirements: '',
    salary: '',
    salaryPeriod: 'month',
    location: '',
    workingHours: '',
    jobType: 'fullTime',
    contactEmail: '',
    contactPhone: '',
  });

  const jobCategories = [
    { value: 'delivery', label: t.delivery },
    { value: 'cleaning', label: t.cleaning },
    { value: 'cooking', label: t.cooking },
    { value: 'security', label: t.security },
    { value: 'construction', label: t.construction },
    { value: 'retail', label: t.retail },
  ];

  const jobTypes = [
    { value: 'fullTime', label: t.fullTime },
    { value: 'partTime', label: t.partTime },
    { value: 'contract', label: t.contract },
  ];

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title || !formData.category || !formData.description || !formData.salary || !formData.location) {
      toast.error("Please fill in all required fields");
      if (isSupported) speak("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    // Simulate job posting
    setTimeout(() => {
      const jobData = {
        ...formData,
        id: Date.now().toString(),
        postedDate: new Date().toISOString(),
        applications: 0,
        status: 'Active',
      };
      
      // Save to localStorage (in real app, send to backend)
      const existingJobs = JSON.parse(localStorage.getItem('companyJobs') || '[]');
      existingJobs.push(jobData);
      localStorage.setItem('companyJobs', JSON.stringify(existingJobs));
      
      toast.success("Job posted successfully!");
      if (isSupported) speak("Job posted successfully! Your job is now live and visible to workers.");
      
      navigate('/company/dashboard');
      setLoading(false);
    }, 2000);
  };

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
          <h1 className="text-2xl font-bold">{t.postJob}</h1>
        </div>
        <p className="text-white/80">
          Create a new job posting to attract qualified workers
        </p>
      </div>

      <div className="px-6 -mt-4 pb-6">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Job Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t.jobTitle} *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Food Delivery Partner"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>Job Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select job category" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t.jobDescription} *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the job responsibilities and what the worker will be doing..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">{t.requirements}</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="List the skills, experience, or qualifications needed..."
                  className="min-h-[100px]"
                />
              </div>
            </div>

            {/* Salary and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>{t.salary} *</span>
                </Label>
                <div className="flex space-x-2">
                  <Input
                    value={formData.salary}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value.replace(/\D/g, '') }))}
                    placeholder="25000"
                    className="h-12"
                  />
                  <Select value={formData.salaryPeriod} onValueChange={(value) => setFormData(prev => ({ ...prev, salaryPeriod: value }))}>
                    <SelectTrigger className="h-12 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">/month</SelectItem>
                      <SelectItem value="day">/day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{t.location} *</span>
                </Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Koramangala, Bangalore"
                  className="h-12"
                />
              </div>
            </div>

            {/* Working Hours and Job Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{t.workingHours}</span>
                </Label>
                <Input
                  value={formData.workingHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, workingHours: e.target.value }))}
                  placeholder="e.g., 9 AM - 6 PM"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>{t.jobType}</Label>
                <Select value={formData.jobType} onValueChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="hr@company.com"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="+91 9876543210"
                  className="h-12"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                size="lg"
                className="w-full bg-accent hover:bg-accent-hover"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting Job...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Post Job
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobPosting;