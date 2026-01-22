import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Bell, User, FileText, Calendar, 
  CheckCircle, Clock, MessageSquare, Volume2 
} from 'lucide-react';

interface CompanyNotification {
  id: string;
  type: 'new_application' | 'interview_reminder' | 'job_expired' | 'message_received';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionRequired?: boolean;
  applicantName?: string;
  jobTitle?: string;
}

const CompanyNotifications = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();

  const [notifications] = useState<CompanyNotification[]>([
    {
      id: '1',
      type: 'new_application',
      title: 'New Job Application',
      message: 'Rajesh Kumar applied for Delivery Partner position. Review their application and contact details.',
      time: '5 minutes ago',
      isRead: false,
      actionRequired: true,
      applicantName: 'Rajesh Kumar',
      jobTitle: 'Delivery Partner',
    },
    {
      id: '2',
      type: 'new_application',
      title: 'New Job Application',
      message: 'Priya Sharma applied for Office Cleaner position. They have 3 years of experience.',
      time: '1 hour ago',
      isRead: false,
      actionRequired: true,
      applicantName: 'Priya Sharma',
      jobTitle: 'Office Cleaner',
    },
    {
      id: '3',
      type: 'interview_reminder',
      title: 'Interview Reminder',
      message: 'Interview with Mohammed Ali for Security Guard position is scheduled for today at 3:00 PM.',
      time: '2 hours ago',
      isRead: true,
      actionRequired: true,
      applicantName: 'Mohammed Ali',
      jobTitle: 'Security Guard',
    },
    {
      id: '4',
      type: 'message_received',
      title: 'New Message',
      message: 'Sunita Devi sent you a message regarding the Cook Assistant position.',
      time: '4 hours ago',
      isRead: true,
      actionRequired: false,
      applicantName: 'Sunita Devi',
      jobTitle: 'Cook Assistant',
    },
    {
      id: '5',
      type: 'job_expired',
      title: 'Job Posting Expired',
      message: 'Your Security Guard job posting has expired. Renew it to continue receiving applications.',
      time: '1 day ago',
      isRead: true,
      actionRequired: true,
      jobTitle: 'Security Guard',
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_application':
        return <FileText className="w-5 h-5 text-primary" />;
      case 'interview_reminder':
        return <Calendar className="w-5 h-5 text-warning" />;
      case 'job_expired':
        return <Clock className="w-5 h-5 text-destructive" />;
      case 'message_received':
        return <MessageSquare className="w-5 h-5 text-accent" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const readNotifications = () => {
    if (isSupported) {
      const unreadCount = notifications.filter(n => !n.isRead).length;
      let message = `You have ${notifications.length} total notifications. ${unreadCount} unread. `;
      
      const latestNotification = notifications[0];
      if (latestNotification) {
        message += `Latest: ${latestNotification.title}. ${latestNotification.message}`;
      }
      
      speak(message, { rate: 0.8 });
    }
  };

  const readNotification = (notification: CompanyNotification) => {
    if (isSupported) {
      const message = `${notification.title}. ${notification.message}. ${notification.time}.`;
      speak(message, { rate: 0.8 });
    }
  };

  const handleNotificationAction = (notification: CompanyNotification) => {
    switch (notification.type) {
      case 'new_application':
        navigate('/company/applications');
        break;
      case 'message_received':
        navigate('/company/messages');
        break;
      case 'interview_reminder':
        navigate('/company/applications');
        break;
      case 'job_expired':
        navigate('/company/post-job');
        break;
      default:
        break;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
            <div>
              <h1 className="text-2xl font-bold">{t.notifications}</h1>
              <p className="text-white/80">
                {notifications.length} total, {unreadCount} unread
              </p>
            </div>
          </div>
          
          {isSupported && (
            <Button
              onClick={readNotifications}
              variant="secondary"
              size="sm"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="px-6 -mt-4 pb-6">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`shadow-soft cursor-pointer transition-all hover:shadow-medium ${
                  !notification.isRead ? 'border-accent/20 bg-accent/5' : ''
                }`}
                onClick={() => readNotification(notification)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${
                      !notification.isRead ? 'bg-accent/10' : 'bg-muted'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold ${
                          !notification.isRead ? 'text-card-foreground' : 'text-muted-foreground'
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                          )}
                          {notification.actionRequired && (
                            <Badge variant="secondary" className="text-xs">
                              Action Required
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-3 leading-relaxed ${
                        !notification.isRead ? 'text-card-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <p className="text-xs text-muted-foreground flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{notification.time}</span>
                          </p>
                          
                          {notification.applicantName && (
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <User className="w-3 h-3" />
                              <span>{notification.applicantName}</span>
                            </div>
                          )}
                          
                          {notification.jobTitle && (
                            <div className="text-xs text-muted-foreground">
                              <span>{notification.jobTitle}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {notification.actionRequired && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationAction(notification);
                              }}
                              className="bg-accent hover:bg-accent-hover"
                            >
                              Take Action
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationAction(notification);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-soft">
            <CardContent className="p-8 text-center">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
              <p className="text-muted-foreground mb-4">
                When workers apply for your jobs or send messages, you'll receive notifications here.
              </p>
              <Button onClick={() => navigate('/company/post-job')}>
                Post Your First Job
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick actions for notifications with actions required */}
        {notifications.some(n => n.actionRequired) && (
          <Card className="shadow-soft mt-6 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-card-foreground">
                    Actions Required
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notifications.filter(n => n.actionRequired).length} items need your attention
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate('/company/applications')}
                >
                  Review All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CompanyNotifications;