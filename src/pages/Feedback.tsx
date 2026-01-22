import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Star, ThumbsUp, MessageSquare, TrendingUp, Volume2, User } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  type: 'received' | 'given';
  rating: number;
  comment: string;
  date: Date;
  jobTitle: string;
  reviewerName: string;
}

const Feedback = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();
  const [activeTab, setActiveTab] = useState('received');
  const [newFeedback, setNewFeedback] = useState('');
  const [rating, setRating] = useState(0);

  // Sample reviews data
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      type: 'received',
      rating: 5,
      comment: 'Excellent work! Very punctual and professional delivery service.',
      date: new Date('2024-01-15'),
      jobTitle: 'Food Delivery Partner',
      reviewerName: 'QuickEats Manager'
    },
    {
      id: '2',
      type: 'received',
      rating: 4,
      comment: 'Good cleaning service, very thorough and reliable.',
      date: new Date('2024-01-10'),
      jobTitle: 'Office Cleaner',
      reviewerName: 'CleanCorp Supervisor'
    },
    {
      id: '3',
      type: 'given',
      rating: 5,
      comment: 'Great company to work with, fair payment and good support.',
      date: new Date('2024-01-08'),
      jobTitle: 'Security Guard',
      reviewerName: 'SecureShield Services'
    }
  ]);

  const receivedReviews = reviews.filter(r => r.type === 'received');
  const givenReviews = reviews.filter(r => r.type === 'given');
  const averageRating = receivedReviews.length > 0 
    ? receivedReviews.reduce((sum, r) => sum + r.rating, 0) / receivedReviews.length 
    : 0;

  const handleSubmitFeedback = () => {
    if (!newFeedback.trim() || rating === 0) {
      toast.error('Please provide both rating and feedback');
      return;
    }

    toast.success('Feedback submitted successfully!');
    setNewFeedback('');
    setRating(0);
    
    if (isSupported) {
      speak('Feedback submitted successfully');
    }
  };

  const readReviews = () => {
    if (isSupported) {
      const message = `You have ${receivedReviews.length} reviews received with average rating ${averageRating.toFixed(1)} stars, and ${givenReviews.length} reviews given.`;
      speak(message);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Feedback & Reviews</h1>
            <p className="text-white/80">
              {receivedReviews.length} reviews • {averageRating.toFixed(1)} ⭐ average
            </p>
          </div>
          {isSupported && (
            <Button
              onClick={readReviews}
              variant="secondary"
              size="sm"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="px-6 -mt-4 pb-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {receivedReviews.length}
              </div>
              <p className="text-sm text-muted-foreground">Reviews</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">
                {averageRating.toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Rating</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success mb-1">
                {receivedReviews.filter(r => r.rating >= 4).length}
              </div>
              <p className="text-sm text-muted-foreground">Positive</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="given">Given</TabsTrigger>
            <TabsTrigger value="give">Give Feedback</TabsTrigger>
          </TabsList>

          {/* Received Reviews */}
          <TabsContent value="received" className="space-y-4">
            {receivedReviews.map((review) => (
              <Card key={review.id} className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.reviewerName}</p>
                          <p className="text-sm text-muted-foreground">{review.jobTitle}</p>
                        </div>
                        <div className="text-right">
                          {renderStars(review.rating)}
                          <p className="text-xs text-muted-foreground mt-1">
                            {review.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Given Reviews */}
          <TabsContent value="given" className="space-y-4">
            {givenReviews.map((review) => (
              <Card key={review.id} className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.reviewerName}</p>
                          <p className="text-sm text-muted-foreground">{review.jobTitle}</p>
                        </div>
                        <div className="text-right">
                          {renderStars(review.rating)}
                          <p className="text-xs text-muted-foreground mt-1">
                            {review.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Give Feedback */}
          <TabsContent value="give" className="space-y-4">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Give Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Rating</label>
                  {renderStars(rating, true, setRating)}
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Feedback</label>
                  <Textarea
                    value={newFeedback}
                    onChange={(e) => setNewFeedback(e.target.value)}
                    placeholder="Share your experience working with this employer..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button 
                  onClick={handleSubmitFeedback}
                  size="lg"
                  className="w-full"
                  disabled={!newFeedback.trim() || rating === 0}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Feedback;
