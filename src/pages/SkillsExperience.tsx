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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, X, Briefcase, GraduationCap, Award, Languages, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  duration: string;
  description: string;
  category: string;
}

interface Language {
  name: string;
  fluency: 'beginner' | 'intermediate' | 'advanced' | 'native';
}

const SkillsExperience = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [education, setEducation] = useState('');
  
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddLanguage, setShowAddLanguage] = useState(false);
  const [showAddCertification, setShowAddCertification] = useState(false);
  
  const [newExperience, setNewExperience] = useState({
    jobTitle: '',
    company: '',
    duration: '',
    description: '',
    category: 'delivery'
  });
  
  const [newLanguage, setNewLanguage] = useState({
    name: '',
    fluency: 'intermediate' as const
  });
  
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    // Load saved data
    const savedData = localStorage.getItem('zeroBarrierSkillsExperience');
    if (savedData) {
      const data = JSON.parse(savedData);
      setExperiences(data.experiences || []);
      setLanguages(data.languages || []);
      setCertifications(data.certifications || []);
      setEducation(data.education || '');
    }
  }, []);

  const saveData = () => {
    const data = {
      experiences,
      languages,
      certifications,
      education
    };
    localStorage.setItem('zeroBarrierSkillsExperience', JSON.stringify(data));
  };

  const addExperience = () => {
    if (!newExperience.jobTitle || !newExperience.company) {
      toast.error("Please fill in job title and company");
      return;
    }

    const experience: Experience = {
      id: Date.now().toString(),
      ...newExperience
    };

    setExperiences(prev => [...prev, experience]);
    setNewExperience({
      jobTitle: '',
      company: '',
      duration: '',
      description: '',
      category: 'delivery'
    });
    setShowAddExperience(false);
    saveData();
    
    if (isSupported) {
      speak(`Added ${newExperience.jobTitle} experience`);
    }
    toast.success("Experience added successfully");
  };

  const removeExperience = (id: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
    saveData();
  };

  const addLanguage = () => {
    if (!newLanguage.name) {
      toast.error("Please enter language name");
      return;
    }

    if (languages.some(lang => lang.name.toLowerCase() === newLanguage.name.toLowerCase())) {
      toast.error("Language already added");
      return;
    }

    setLanguages(prev => [...prev, newLanguage]);
    setNewLanguage({ name: '', fluency: 'intermediate' });
    setShowAddLanguage(false);
    saveData();
    toast.success("Language added successfully");
  };

  const removeLanguage = (name: string) => {
    setLanguages(prev => prev.filter(lang => lang.name !== name));
    saveData();
  };

  const addCertification = () => {
    if (!newCertification.trim()) {
      toast.error("Please enter certification name");
      return;
    }

    if (certifications.includes(newCertification.trim())) {
      toast.error("Certification already added");
      return;
    }

    setCertifications(prev => [...prev, newCertification.trim()]);
    setNewCertification('');
    setShowAddCertification(false);
    saveData();
    toast.success("Certification added successfully");
  };

  const removeCertification = (cert: string) => {
    setCertifications(prev => prev.filter(c => c !== cert));
    saveData();
  };

  const readProfile = () => {
    if (isSupported) {
      const message = `You have ${experiences.length} work experiences, ${languages.length} languages, and ${certifications.length} certifications added to your profile.`;
      speak(message);
    }
  };

  const jobCategories = [
    { value: 'delivery', label: 'Delivery' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'cooking', label: 'Cooking' },
    { value: 'security', label: 'Security' },
    { value: 'construction', label: 'Construction' },
    { value: 'retail', label: 'Retail' },
    { value: 'other', label: 'Other' }
  ];

  const fluencyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'native', label: 'Native' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={() => navigate('/worker/profile')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Skills & Experience</h1>
        </div>

        {isSupported && (
          <Button
            onClick={readProfile}
            variant="secondary"
            size="sm"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Read Profile
          </Button>
        )}
      </div>

      <div className="px-6 -mt-4 pb-6 space-y-6">
        {/* Work Experience */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5" />
                <span>Work Experience</span>
              </div>
              <Button
                onClick={() => setShowAddExperience(true)}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {experiences.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No work experience added yet. Add your first experience to improve job matches.
              </p>
            ) : (
              experiences.map((exp) => (
                <div key={exp.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{exp.jobTitle}</h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                      <p className="text-sm text-muted-foreground">{exp.duration}</p>
                      {exp.description && (
                        <p className="text-sm mt-2">{exp.description}</p>
                      )}
                      <Badge variant="secondary" className="mt-2">
                        {jobCategories.find(cat => cat.value === exp.category)?.label}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => removeExperience(exp.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}

            {showAddExperience && (
              <Card className="border-primary/20">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        value={newExperience.jobTitle}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, jobTitle: e.target.value }))}
                        placeholder="e.g. Delivery Driver"
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={newExperience.company}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="e.g. Swiggy"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Duration</Label>
                      <Input
                        value={newExperience.duration}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g. 2 years"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={newExperience.category}
                        onValueChange={(value) => setNewExperience(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {jobCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Description (Optional)</Label>
                    <Textarea
                      value={newExperience.description}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={addExperience} size="sm">
                      Add Experience
                    </Button>
                    <Button
                      onClick={() => setShowAddExperience(false)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Languages className="w-5 h-5" />
                <span>Languages</span>
              </div>
              <Button
                onClick={() => setShowAddLanguage(true)}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {languages.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No languages added yet. Add languages you can speak.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <Badge
                    key={lang.name}
                    variant="secondary"
                    className="text-sm px-3 py-2 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeLanguage(lang.name)}
                  >
                    {lang.name} ({lang.fluency})
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {showAddLanguage && (
              <Card className="border-primary/20">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Language</Label>
                      <Input
                        value={newLanguage.name}
                        onChange={(e) => setNewLanguage(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. English"
                      />
                    </div>
                    <div>
                      <Label>Fluency Level</Label>
                      <Select
                        value={newLanguage.fluency}
                        onValueChange={(value: any) => setNewLanguage(prev => ({ ...prev, fluency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fluencyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={addLanguage} size="sm">
                      Add Language
                    </Button>
                    <Button
                      onClick={() => setShowAddLanguage(false)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Certifications</span>
              </div>
              <Button
                onClick={() => setShowAddCertification(true)}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {certifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No certifications added yet. Add your professional certifications.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <Badge
                    key={cert}
                    variant="secondary"
                    className="text-sm px-3 py-2 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => removeCertification(cert)}
                  >
                    {cert}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {showAddCertification && (
              <Card className="border-primary/20">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <Label>Certification Name</Label>
                    <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="e.g. Food Safety Certificate"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={addCertification} size="sm">
                      Add Certification
                    </Button>
                    <Button
                      onClick={() => setShowAddCertification(false)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5" />
              <span>Education</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Highest Education</Label>
              <Select
                value={education}
                onValueChange={(value) => {
                  setEducation(value);
                  saveData();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-formal">No Formal Education</SelectItem>
                  <SelectItem value="primary">Primary School</SelectItem>
                  <SelectItem value="secondary">Secondary School (10th)</SelectItem>
                  <SelectItem value="higher-secondary">Higher Secondary (12th)</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={() => {
            saveData();
            toast.success("Profile updated successfully");
            navigate('/worker/profile');
          }}
          size="lg"
          className="w-full"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SkillsExperience;