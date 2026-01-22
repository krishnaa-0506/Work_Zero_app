import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const skillCategories = [
  'Construction',
  'Driving',
  'Factory Work',
  'Housekeeping',
  'Security',
  'Hospitality',
  'Retail',
  'Maintenance',
  'Other'
];

const AddNewSkill = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [skillName, setSkillName] = useState('');
  const [experienceLevel, setExperienceLevel] = useState([50]);
  const [certifications, setCertifications] = useState(['']);
  const [category, setCategory] = useState('');

  const handleAddCertification = () => {
    setCertifications([...certifications, '']);
  };

  const handleCertificationChange = (index: number, value: string) => {
    const newCertifications = [...certifications];
    newCertifications[index] = value;
    setCertifications(newCertifications);
  };

  const handleRemoveCertification = (index: number) => {
    const newCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(newCertifications);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skillName || !category) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Here you would typically make an API call to save the skill
      // For now, we'll just show a success message
      toast({
        title: 'Success!',
        description: 'Your skill has been added successfully.',
      });
      
      // Navigate back to skills page
      navigate('/skills');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add skill. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate('/skills')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Add New Skill</h1>
        </div>
      </div>

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Skill Details</CardTitle>
            <CardDescription>Add information about your skill and experience</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Skill Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {skillCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="Enter skill name"
                />
              </div>

              <div className="space-y-2">
                <Label>Experience Level</Label>
                <div className="pt-2">
                  <Slider
                    value={experienceLevel}
                    onValueChange={setExperienceLevel}
                    max={100}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Beginner</span>
                    <span>Expert</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Certifications (Optional)</Label>
                {certifications.map((cert, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={cert}
                      onChange={(e) => handleCertificationChange(index, e.target.value)}
                      placeholder="Enter certification name"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveCertification(index)}
                      className="shrink-0"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCertification}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/skills')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Skill
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AddNewSkill;
