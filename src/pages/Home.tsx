import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Job } from '@/types/job';
import { useJobSocket } from '@/hooks/useJobSocket';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  CheckCircle, 
  Volume2, 
  Sliders
} from 'lucide-react';
import { TopBar } from '@/components/ui/top-bar';
import { JobCategoryCard } from '@/components/ui/job-category-card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Home = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { jobs, loading, error, searchJobs } = useJobSocket();
  const [currentLocation, setCurrentLocation] = useState<{lat: number; lng: number} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [distance, setDistance] = useState([10]); // 10km max
  const [isFullTime, setIsFullTime] = useState(true);
  const [isGovtOnly, setIsGovtOnly] = useState(false);
  
  const { speak, isSupported } = useVoiceAssistant();

  useEffect(() => {
    // Get user's location and search for nearby jobs
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setCurrentLocation({ lat, lng });
          searchJobs({
            lat,
            lng,
            radius: distance[0],
            category: selectedCategory || undefined
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fall back to searching without location
          searchJobs({
            category: selectedCategory || undefined
          });
        }
      );
    }

    // Welcome message on first load
    const hasWelcomed = sessionStorage.getItem('zeroBarrierWelcomed');
    if (!hasWelcomed && isSupported) {
      setTimeout(() => {
        speak(`Welcome to ${t.appName}. ${t.nearbyJobs} available.`, { rate: 0.8 });
        sessionStorage.setItem('zeroBarrierWelcomed', 'true');
      }, 1000);
    }
  }, [speak, t.appName, t.nearbyJobs, isSupported, distance, selectedCategory]);

  // Filter jobs based on selected category and filters
  const filteredJobs = jobs.filter(job => {
    if (selectedCategory && job.category !== selectedCategory) return false;
    if (job.distance > distance[0]) return false;
    if (isFullTime && job.salary.period !== 'month') return false;
    // Add government job filter logic here when backend supports it
    return true;
  });

  const handleJobApply = (job: Job) => {
    if (isSupported) {
      speak(`Applying for ${job.title} at ${job.company}`, { rate: 0.9 });
    }
    
    navigate('/application-sent', { 
      state: { 
        jobTitle: job.title, 
        company: job.company 
      } 
    });
  };

  const readJobDetails = (job: Job) => {
    if (isSupported) {
      const details = `
        ${job.title} at ${job.company}. 
        Salary: ${formatSalary(job)}. 
        Location: ${job.distance} kilometers away. 
        Working hours: ${job.workingHours}. 
        Description: ${job.description}
      `;
      speak(details, { rate: 0.8 });
    }
  };

  const formatSalary = (job: Job) => {
    const currency = language === 'hi' || language === 'ta' ? '₹' : '₹';
    const amount = job.salary.amount.toLocaleString();
    const period = job.salary.period === 'month' ? t.perMonth : t.perDay;
    return `${currency}${amount}${period}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <TopBar
        userName="John Doe"
        userPhoto="/placeholder.svg"
        trustScore={4}
        isAadhaarVerified={true}
      />

      {/* Job Categories */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <JobCategoryCard
          type="construction"
          onSelect={setSelectedCategory}
          isSelected={selectedCategory === 'construction'}
        />
        <JobCategoryCard
          type="logistics"
          onSelect={setSelectedCategory}
          isSelected={selectedCategory === 'logistics'}
        />
      </div>

      {/* Filter Bar */}
      <div className="px-4 py-2 flex items-center justify-between bg-white border-t border-b">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="space-x-2">
              <Sliders className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Job Filters</SheetTitle>
              <SheetDescription>
                Adjust these settings to find your perfect job match
              </SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-6">
              <div className="space-y-2">
                <Label>Distance (km)</Label>
                <Slider
                  value={distance}
                  onValueChange={setDistance}
                  max={10}
                  step={1}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0 km</span>
                  <span>{distance[0]} km</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Full-time only</Label>
                <Switch
                  checked={isFullTime}
                  onCheckedChange={setIsFullTime}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Government jobs only</Label>
                <Switch
                  checked={isGovtOnly}
                  onCheckedChange={setIsGovtOnly}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="text-sm"
          >
            Clear filters
          </Button>
        </div>
      </div>

      {/* Job Feed */}
      <div className="p-4 pb-20 space-y-4">
        {filteredJobs.map((job) => (
          <Card 
            key={job.id} 
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {job.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{job.company}</span>
                    {job.isVerified && (
                      <Badge variant="secondary" className="bg-success/10 text-success text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {t.companyVerified}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => readJobDetails(job)}
                  className="text-muted-foreground"
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl font-bold text-primary">
                  {formatSalary(job)}
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.distance} {t.kmAway}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{job.workingHours}</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => handleJobApply(job)}
                className="w-full bg-accent hover:bg-accent-hover"
              >
                {t.applyNow}
              </Button>
            </CardContent>
          </Card>
        ))}

        {filteredJobs.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or check back later for new opportunities.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory(null);
                setDistance([10]);
                setIsFullTime(true);
                setIsGovtOnly(false);
              }}
            >
              Reset Filters
            </Button>
          </Card>
        )}
      </div>

    </div>
  );
};

export default Home;