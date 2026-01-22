import { ArrowLeft, Phone, HelpCircle, MessageSquare, AlertCircle, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Support = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const faqs = [
    {
      question: t.faqHowToApply,
      answer: t.faqAnswer1
    },
    {
      question: t.faqTrackApplications,
      answer: t.faqAnswer2
    },
    {
      question: t.faqSkillBadges,
      answer: t.faqAnswer3
    },
    {
      question: t.faqContactEmployers,
      answer: t.faqAnswer4
    }
  ];

  const emergencyContacts = [
    {
      title: "24/7 Helpline",
      number: "1800-123-4567",
      description: "Round-the-clock support for urgent assistance"
    },
    {
      title: "Worker Safety Hotline",
      number: "1800-789-0123",
      description: "Report safety concerns or workplace issues"
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
          <h1 className="text-2xl font-bold">{t.helpAndSupport}</h1>
        </div>
        <p className="text-white/90">{t.weAreHere}</p>
      </div>

      {/* Emergency Support */}
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            {t.emergencySupport}
          </h2>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-medium">{contact.title}</h3>
                      <p className="text-lg font-semibold text-blue-600">{contact.number}</p>
                      <p className="text-sm text-muted-foreground">{contact.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            className="h-24 flex-col space-y-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/support/call')}
          >
            <Headphones className="w-6 h-6" />
            <span>{t.callSupport}</span>
          </Button>
          <Button 
            className="h-24 flex-col space-y-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/support/chat')}
          >
            <MessageSquare className="w-6 h-6" />
            <span>{t.chatSupport}</span>
          </Button>
        </div>

        {/* FAQs */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <HelpCircle className="w-5 h-5 mr-2 text-blue-600" />
            {t.frequentlyAskedQuestions}
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Support;
