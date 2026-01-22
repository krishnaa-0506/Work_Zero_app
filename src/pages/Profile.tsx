import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, CheckCircle, Plus, Edit, Volume2, Star, Shield, Award, Briefcase, MessageSquare, Settings } from 'lucide-react';

interface UserProfile {
  name: string;
  age: string;
  gender: string;
  isVerified: boolean;
  skills: string[];
  completedJobs: number;
  totalEarnings: number;
  rating: number;
  isBackgroundVerified: boolean;
  trustScore: number;
  feedbacks: CompanyFeedback[];
}

interface CompanyFeedback {
  id: string;
  companyName: string;
  rating: number;
  comment: string;
  jobTitle: string;
  date: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Load user profile from localStorage
    const savedUser = localStorage.getItem('zeroBarrierUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setProfile({
        name: userData.name || 'User',
        age: userData.age || 'Not specified',
        gender: userData.gender || 'Not specified',
        isVerified: userData.isVerified || false,
        skills: userData.skills || ['delivery', 'cleaning'], // Default skills
        completedJobs: userData.completedJobs || 12,
        totalEarnings: userData.totalEarnings || 25000,
        rating: userData.rating || 4.7,
        isBackgroundVerified: userData.isBackgroundVerified || true,
        trustScore: userData.trustScore || 95,
        feedbacks: userData.feedbacks || [
          {
            id: '1',
            companyName: 'Tech Solutions Ltd',
            rating: 5,
            comment: 'Excellent work! Very punctual and professional. Completed the task ahead of schedule.',
            jobTitle: 'Office Cleaning',
            date: '2024-09-15'
          },
          {
            id: '2',
            companyName: 'Food Express Co',
            rating: 4,
            comment: 'Good delivery service. Items delivered safely and on time.',
            jobTitle: 'Food Delivery',
            date: '2024-09-10'
          },
          {
            id: '3',
            companyName: 'Metro Construction',
            rating: 5,
            comment: 'Hardworking and reliable. Would definitely hire again for future projects.',
            jobTitle: 'Construction Helper',
            date: '2024-09-05'
          }
        ]
      });
    } else {
      // Default profile if none exists
      setProfile({
        name: 'John Doe',
        age: '25-35',
        gender: 'male',
        isVerified: true,
        skills: ['delivery', 'cleaning', 'cooking'],
        completedJobs: 12,
        totalEarnings: 25000,
        rating: 4.7,
        isBackgroundVerified: true,
        trustScore: 95,
        feedbacks: [
          {
            id: '1',
            companyName: 'Tech Solutions Ltd',
            rating: 5,
            comment: 'Excellent work! Very punctual and professional. Completed the task ahead of schedule.',
            jobTitle: 'Office Cleaning',
            date: '2024-09-15'
          },
          {
            id: '2',
            companyName: 'Food Express Co',
            rating: 4,
            comment: 'Good delivery service. Items delivered safely and on time.',
            jobTitle: 'Food Delivery',
            date: '2024-09-10'
          },
          {
            id: '3',
            companyName: 'Metro Construction',
            rating: 5,
            comment: 'Hardworking and reliable. Would definitely hire again for future projects.',
            jobTitle: 'Construction Helper',
            date: '2024-09-05'
          }
        ]
      });
    }
  }, []);

  const skillIcons: Record<string, string> = {
    delivery: '🚚',
    cleaning: '🧹',
    cooking: '🍳',
    security: '🛡️',
    construction: '🏗️',
    retail: '🏪',
  };

  const availableSkills = ['delivery', 'cleaning', 'cooking', 'security', 'construction', 'retail'];

  const addSkill = (skill: string) => {
    if (profile && !profile.skills.includes(skill)) {
      const updatedProfile = {
        ...profile,
        skills: [...profile.skills, skill],
      };
      setProfile(updatedProfile);
      localStorage.setItem('zeroBarrierUser', JSON.stringify(updatedProfile));
      
      if (isSupported) {
        speak(`${t[skill as keyof typeof t]} skill added to your profile`, { rate: 0.9 });
      }
    }
  };

  const removeSkill = (skill: string) => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        skills: profile.skills.filter(s => s !== skill),
      };
      setProfile(updatedProfile);
      localStorage.setItem('zeroBarrierUser', JSON.stringify(updatedProfile));
    }
  };

  const readProfile = () => {
    if (isSupported && profile) {
      const skillsList = profile.skills
        .map(skill => t[skill as keyof typeof t] as string)
        .join(', ');
      
      const message = `
        Your profile: ${profile.name}, age ${profile.age}, 
        ${profile.isVerified ? 'Aadhaar verified' : 'Not verified'}.
        ${profile.isBackgroundVerified ? 'Background verified.' : ''}
        You have completed ${profile.completedJobs} jobs with an average rating of ${profile.rating} stars.
        Your trust score is ${profile.trustScore} percent.
        Total earnings: ${profile.totalEarnings} rupees.
        Your skills are: ${skillsList}
      `;
      speak(message, { rate: 0.8 });
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full animate-pulse"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/home')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">{t.profile}</h1>
          </div>
          <Button
            onClick={() => navigate('/settings')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <Settings className="w-5 h-5" />
          </Button>
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

      <div className="px-6 -mt-4 pb-6">
        {/* Profile overview */}
        <Card className="shadow-medium mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-card-foreground mb-1">
                  {profile.name}
                </h2>
                <div className="flex items-center space-x-2 mb-2 flex-wrap gap-2">
                  <Badge variant={profile.isVerified ? "default" : "secondary"}>
                    {profile.isVerified && <CheckCircle className="w-3 h-3 mr-1" />}
                    {profile.isVerified ? t.aadhaarVerified : 'Not Verified'}
                  </Badge>
                  {profile.isBackgroundVerified && (
                    <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                      <Shield className="w-3 h-3 mr-1" />
                      Background Verified
                    </Badge>
                  )}
                  {profile.trustScore >= 90 && (
                    <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                      <Award className="w-3 h-3 mr-1" />
                      Trusted Worker
                    </Badge>
                  )}
                  {profile.rating >= 4.5 && (
                    <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                      <Star className="w-3 h-3 mr-1" />
                      Top Rated
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{profile.rating}</span>
                    <span className="text-muted-foreground text-sm">({profile.feedbacks.length} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Briefcase className="w-4 h-4 text-green-500" />
                    <span className="font-semibold">{profile.completedJobs}</span>
                    <span className="text-muted-foreground text-sm">jobs completed</span>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Age: {profile.age} • Gender: {profile.gender}
                </p>
                <p className="text-sm text-green-600 font-semibold mt-1">
                  Total Earnings: ₹{profile.totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Skills section */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t.skills}
              <Badge variant="secondary">{profile.skills.length} skills</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Current skills */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Your Skills
              </h3>
              {profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="default"
                      className="text-sm px-3 py-2 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeSkill(skill)}
                    >
                      <span className="mr-2">{skillIcons[skill]}</span>
                      {t[skill as keyof typeof t] as string}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No skills added yet. Add skills to improve your job matches.
                </p>
              )}
            </div>

            {/* Available skills to add */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {t.addSkill}
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableSkills
                  .filter(skill => !profile.skills.includes(skill))
                  .map((skill) => (
                    <Button
                      key={skill}
                      variant="outline"
                      size="sm"
                      onClick={() => addSkill(skill)}
                      className="text-sm hover:bg-primary hover:text-primary-foreground"
                    >
                      <span className="mr-2">{skillIcons[skill]}</span>
                      <Plus className="w-3 h-3 mr-1" />
                      {t[skill as keyof typeof t] as string}
                    </Button>
                  ))}
              </div>
            </div>

            {profile.skills.length >= availableSkills.length && (
              <div className="mt-6 p-4 bg-success-light rounded-lg">
                <p className="text-success text-sm font-medium text-center">
                  🎉 Congratulations! You've added all available skills.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {profile.completedJobs}
              </div>
              <p className="text-sm text-muted-foreground">Jobs Completed</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                ₹{(profile.totalEarnings / 1000).toFixed(1)}K
              </div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-1">
                <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                <span className="text-2xl font-bold text-yellow-600">{profile.rating}</span>
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {profile.trustScore}%
              </div>
              <p className="text-sm text-muted-foreground">Trust Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Verification Upgrade */}
        {profile.trustScore < 98 && (
          <Card className="shadow-soft mt-6 border-2 border-gradient-to-r from-blue-200 to-indigo-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Upgrade to Gold Verification
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Get 98% trust score with our DigiLocker-grade verification system. 
                    Access premium jobs and earn 2x more.
                  </p>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>Government eKYC</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-blue-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>Advanced Face Match</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-purple-600">
                      <CheckCircle className="w-3 h-3" />
                      <span>Live Detection</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/worker/digital-verification')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Get Gold Verification
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Company Feedback Section */}
        <Card className="shadow-medium mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Company Reviews
              <Badge variant="secondary" className="ml-2">{profile.feedbacks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.feedbacks.map((feedback) => (
                <div key={feedback.id} className="border-l-4 border-primary/20 pl-4 py-3 bg-muted/30 rounded-r-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{feedback.companyName}</h4>
                      <p className="text-xs text-muted-foreground">{feedback.jobTitle}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < feedback.rating
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-card-foreground mb-2">{feedback.comment}</p>
                  <p className="text-xs text-muted-foreground">{new Date(feedback.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            {profile.feedbacks.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No reviews yet</p>
                <p className="text-sm text-muted-foreground">Complete jobs to receive feedback from companies</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card className="shadow-medium mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <CheckCircle className={`w-5 h-5 ${profile.isVerified ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium">Aadhaar Verification</p>
                    <p className="text-sm text-muted-foreground">Identity document verified</p>
                  </div>
                </div>
                <Badge variant={profile.isVerified ? "default" : "secondary"}>
                  {profile.isVerified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <Shield className={`w-5 h-5 ${profile.isBackgroundVerified ? 'text-green-500' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium">Background Check</p>
                    <p className="text-sm text-muted-foreground">Criminal background verified</p>
                  </div>
                </div>
                <Badge variant={profile.isBackgroundVerified ? "default" : "secondary"}>
                  {profile.isBackgroundVerified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Trust Score</p>
                    <p className="text-sm text-muted-foreground">Based on work history & reviews</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                  {profile.trustScore}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;