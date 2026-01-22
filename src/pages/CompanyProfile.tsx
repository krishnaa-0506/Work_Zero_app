import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Building2, Edit, Save, X, 
  MapPin, Globe, Users, Calendar, Mail, Phone 
} from 'lucide-react';
import { toast } from 'sonner';

interface CompanyProfile {
  companyName: string;
  email: string;
  industry: string;
  companySize: string;
  website: string;
  description: string;
  contactPerson: string;
  phone: string;
  address: string;
  foundedYear: string;
  totalJobs: number;
  activeJobs: number;
  totalHires: number;
}

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<CompanyProfile>({
    companyName: 'TechCorp Solutions',
    email: 'hr@techcorp.com',
    industry: 'Technology',
    companySize: '51-200 employees',
    website: 'https://techcorp.com',
    description: 'We are a leading technology company focused on innovative solutions for businesses.',
    contactPerson: 'Sarah Johnson',
    phone: '+91 9876543210',
    address: 'Koramangala, Bangalore, Karnataka',
    foundedYear: '2015',
    totalJobs: 25,
    activeJobs: 5,
    totalHires: 150,
  });

  useEffect(() => {
    // Load company profile from localStorage
    const savedProfile = localStorage.getItem('companyData');
    if (savedProfile) {
      const companyData = JSON.parse(savedProfile);
      setProfile(prev => ({ ...prev, ...companyData }));
    }
  }, []);

  const handleSave = () => {
    // Save to localStorage (in real app, send to backend)
    localStorage.setItem('companyData', JSON.stringify(profile));
    setIsEditing(false);
    toast.success("Profile updated successfully!");
    if (isSupported) {
      speak("Profile updated successfully!");
    }
  };

  const handleCancel = () => {
    // Reload from localStorage to cancel changes
    const savedProfile = localStorage.getItem('companyData');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-accent text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/company/dashboard')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <Building2 className="w-6 h-6" />
              <h1 className="text-2xl font-bold">{t.companyName} {t.profile}</h1>
            </div>
          </div>
          
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="secondary"
            size="sm"
          >
            {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </div>

      <div className="px-6 -mt-4 pb-6">
        {/* Company Overview */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Company Overview
              {isEditing && (
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-accent" />
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <Input
                    value={profile.companyName}
                    onChange={(e) => setProfile(prev => ({ ...prev, companyName: e.target.value }))}
                    className="text-xl font-bold mb-2"
                  />
                ) : (
                  <h2 className="text-2xl font-bold mb-1">{profile.companyName}</h2>
                )}
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{profile.industry}</Badge>
                  <Badge variant="outline">{profile.companySize}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.email}</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  {isEditing ? (
                    <Input
                      value={profile.contactPerson}
                      onChange={(e) => setProfile(prev => ({ ...prev, contactPerson: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.contactPerson}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  {isEditing ? (
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.website}</Label>
                  {isEditing ? (
                    <Input
                      value={profile.website}
                      onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  {isEditing ? (
                    <Input
                      value={profile.address}
                      onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Founded Year</Label>
                  {isEditing ? (
                    <Input
                      value={profile.foundedYear}
                      onChange={(e) => setProfile(prev => ({ ...prev, foundedYear: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.foundedYear}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.description}</Label>
              {isEditing ? (
                <Textarea
                  value={profile.description}
                  onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {profile.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Company Statistics */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Company Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">
                  {profile.totalJobs}
                </div>
                <p className="text-sm text-muted-foreground">Total Jobs Posted</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {profile.activeJobs}
                </div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success mb-2">
                  {profile.totalHires}
                </div>
                <p className="text-sm text-muted-foreground">Total Hires</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyProfile;