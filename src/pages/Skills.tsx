import { ArrowLeft, Award, BadgeCheck, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Skill {
  id: string;
  name: string;
  level: number;
  isVerified: boolean;
  certifications: string[];
}

const Skills = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const skills: Skill[] = [
    {
      id: '1',
      name: 'Construction Helper',
      level: 80,
      isVerified: true,
      certifications: ['Basic Safety Training', 'Construction Site Protocol']
    },
    {
      id: '2',
      name: 'Delivery Driver',
      level: 90,
      isVerified: true,
      certifications: ['Driving License', 'Safe Delivery Practices']
    }
  ];

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
          <h1 className="text-2xl font-bold">{t.navSkills}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="w-6 h-6" />
          <p className="text-white/90">{t.skillsAndExperience}</p>
        </div>
      </div>

      {/* Skill Cards */}
      <div className="p-4 space-y-4">
        {skills.map((skill) => (
          <Card key={skill.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {skill.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {skill.isVerified && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <BadgeCheck className="w-3 h-3 mr-1" />
                        Verified Skill
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-lg font-semibold text-blue-600">
                  {skill.level}%
                </div>
              </div>

              <Progress value={skill.level} className="mb-4" />

              <div className="space-y-2">
                <p className="text-sm font-medium">Certifications:</p>
                <div className="flex flex-wrap gap-2">
                  {skill.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Skill Button */}
        <Button
          onClick={() => navigate('/skills/add')}
          className="w-full bg-blue-600 hover:bg-blue-700 h-12"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          {t.addSkill}
        </Button>
      </div>
    </div>
  );
};

export default Skills;
