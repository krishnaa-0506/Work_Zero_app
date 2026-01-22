import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, HelpCircle, MessageSquare, Phone, 
  Mail, Search, Volume2, User, Building2 
} from 'lucide-react';
import { toast } from 'sonner';

const Help = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const faqs = [
    {
      id: '1',
      question: 'How do I apply for jobs?',
      answer: 'To apply for jobs, browse the job listings on the home page, tap on a job that interests you, review the details, and tap "Apply Now". Your application will be sent directly to the employer.',
      category: 'worker',
    },
    {
      id: '2',
      question: 'How do I verify my Aadhaar?',
      answer: 'During signup, enter your 12-digit Aadhaar number, verify the OTP sent to your registered mobile, upload a photo of your Aadhaar card, and take a selfie for face verification.',
      category: 'worker',
    },
    {
      id: '3',
      question: 'How do I post a job?',
      answer: 'From your company dashboard, tap "Post Job", fill in the job details including title, description, salary, and location, then tap "Post Job" to make it live.',
      category: 'company',
    },
    {
      id: '4',
      question: 'How do I review applications?',
      answer: 'Go to your company dashboard and tap "View Applications". You can see all applications, approve or reject them, and schedule interviews with candidates.',
      category: 'company',
    },
    {
      id: '5',
      question: 'How does the voice assistant work?',
      answer: 'The voice assistant helps you navigate the app using voice commands. Tap the microphone icon to speak, and the app will respond in your selected language (English, Hindi, or Tamil).',
      category: 'both',
    },
    {
      id: '6',
      question: 'How do I change my language?',
      answer: 'Go to Settings from your profile menu, select Language, and choose from English, Hindi, or Tamil. The entire app interface and voice assistant will switch to your selected language.',
      category: 'both',
    },
    {
      id: '7',
      question: 'How do I message employers/workers?',
      answer: 'After applying for a job or receiving an application, you can use the Messages feature to communicate directly with employers or workers.',
      category: 'both',
    },
    {
      id: '8',
      question: 'Is my personal information safe?',
      answer: 'Yes, we use industry-standard security measures to protect your personal information. Your Aadhaar details are encrypted and used only for verification purposes.',
      category: 'both',
    },
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate sending contact form
    toast.success("Your message has been sent! We'll get back to you soon.");
    if (isSupported) {
      speak("Your message has been sent! We'll get back to you soon.");
    }
    
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const readFaq = (faq: typeof faqs[0]) => {
    if (isSupported) {
      speak(`${faq.question}. ${faq.answer}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-6 h-6" />
            <h1 className="text-2xl font-bold">{t.help} & Support</h1>
          </div>
        </div>
        <p className="text-white/80">
          Find answers to common questions and get support
        </p>
      </div>

      <div className="px-6 -mt-4 pb-6">
        {/* Search */}
        <Card className="shadow-medium mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help topics..."
                className="pl-10 h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-soft cursor-pointer hover:shadow-medium transition-shadow">
            <CardContent className="p-6 text-center">
              <User className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t.howToApply}</h3>
              <p className="text-sm text-muted-foreground">
                Learn how to find and apply for jobs
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft cursor-pointer hover:shadow-medium transition-shadow">
            <CardContent className="p-6 text-center">
              <Building2 className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t.howToPost}</h3>
              <p className="text-sm text-muted-foreground">
                Learn how to post jobs and hire workers
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft cursor-pointer hover:shadow-medium transition-shadow">
            <CardContent className="p-6 text-center">
              <Volume2 className="w-8 h-8 text-success mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Voice Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Learn how to use voice features
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle>{t.faq}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span>{faq.question}</span>
                      {isSupported && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            readFaq(faq);
                          }}
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try searching with different keywords or contact support
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="shadow-medium mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>{t.contactSupport}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of your issue"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Message *</label>
              <Textarea
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Describe your issue or question in detail..."
                className="min-h-[120px]"
              />
            </div>
            
            <Button onClick={handleContactSubmit} className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Other Ways to Reach Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-muted-foreground">+91 1800-123-4567</p>
                <p className="text-xs text-muted-foreground">Mon-Fri, 9 AM - 6 PM</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">support@zerobarrier.com</p>
                <p className="text-xs text-muted-foreground">We'll respond within 24 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;