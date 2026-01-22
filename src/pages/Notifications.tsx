import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, CheckCircle, Phone, Calendar, Volume2, Settings } from 'lucide-react';

interface Notification {
  id: string;
  type: 'interview' | 'application_update' | 'job_match' | 'call_scheduled';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  actionRequired?: boolean;
  jobTitle?: string;
  company?: string;
}

const Notifications = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();

  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'interview',
      title: t.interviewScheduled,
      message: t.interviewTomorrow,
      time: '2 hours ago',
      isRead: false,
      actionRequired: true,
      jobTitle: 'Delivery Partner',
      company: 'QuickEats',
    },
    {
      id: '2',
      type: 'application_update',
      title: t.applicationApproved,
      message: t.applicationApprovedMsg,
      time: '5 hours ago',
      isRead: false,
      actionRequired: false,
      jobTitle: 'Office Cleaner',
      company: 'CleanCorp',
    },
    {
      id: '3',
      type: 'call_scheduled',
      title: t.callScheduled,
      message: t.callTodayMsg,
      time: '1 day ago',
      isRead: true,
      actionRequired: true,
      jobTitle: 'Cook Assistant',
      company: 'Tasty Bites Restaurant',
    },
    {
      id: '4',
      type: 'job_match',
      title: t.newJobMatch,
      message: t.newJobMatchMsg,
      time: '2 days ago',
      isRead: true,
      actionRequired: false,
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'interview':
        return <Calendar className="w-5 h-5 text-primary" />;
      case 'application_update':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'call_scheduled':
        return <Phone className="w-5 h-5 text-accent" />;
      case 'job_match':
        return <Clock className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const readNotifications = () => {
    if (isSupported) {
      const unreadCount = notifications.filter(n => !n.isRead).length;
      let message = `${notifications.length} ${t.totalNotifications} ${t.notifications}. ${unreadCount} ${t.unreadNotifications}. `;
      
      const latestNotification = notifications[0];
      if (latestNotification) {
        message += `${latestNotification.title}. ${latestNotification.message}`;
      }
      
      speak(message, { rate: 0.8 });
    }
  };

  const readNotification = (notification: Notification) => {
    if (isSupported) {
      const message = `${notification.title}. ${notification.message}. ${notification.time}.`;
      speak(message, { rate: 0.8 });
    }
  };

  const handleTakeAction = (notification: Notification) => {
    if (isSupported) {
      speak(`Taking action for ${notification.title}`);
    }
    
    switch (notification.type) {
      case 'interview':
        // Navigate to interview preparation or confirmation
        navigate('/verification', { 
          state: { 
            type: 'interview', 
            notification 
          } 
        });
        break;
      case 'call_scheduled':
        // Navigate to call preparation
        navigate('/messages', { 
          state: { 
            company: notification.company,
            jobTitle: notification.jobTitle 
          } 
        });
        break;
      default:
        navigate('/worker/profile');
        break;
    }
  };

  const handleViewDetails = (notification: Notification) => {
    if (isSupported) {
      speak(`Viewing details for ${notification.title}`);
    }
    
    // Navigate to detailed view based on notification type
    switch (notification.type) {
      case 'interview':
      case 'call_scheduled':
      case 'application_update':
        navigate('/application-status', { 
          state: { 
            company: notification.company,
            jobTitle: notification.jobTitle,
            notification 
          } 
        });
        break;
      case 'job_match':
        navigate('/home');
        break;
      default:
        navigate('/profile');
        break;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
            <div>
              <h1 className="text-2xl font-bold">{t.notifications}</h1>
              <p className="text-white/80">
                {notifications.length} {t.totalNotifications}, {unreadCount} {t.unreadNotifications}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => navigate('/settings')}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
            >
              <Settings className="w-5 h-5" />
            </Button>
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
      </div>

      <div className="px-6 -mt-4 pb-6">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`shadow-soft cursor-pointer transition-all hover:shadow-medium ${
                  !notification.isRead ? 'border-primary/20 bg-primary/5' : ''
                }`}
                onClick={() => readNotification(notification)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${
                      !notification.isRead ? 'bg-primary/10' : 'bg-muted'
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
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                          {notification.actionRequired && (
                            <Badge variant="secondary" className="text-xs">
                              {t.actionRequired}
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
                        <p className="text-xs text-muted-foreground flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{notification.time}</span>
                        </p>
                        
                        {notification.jobTitle && (
                          <div className="text-right">
                            <p className="text-xs font-medium text-primary">
                              {notification.jobTitle}
                            </p>
                            {notification.company && (
                              <p className="text-xs text-muted-foreground">
                                {notification.company}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {notification.actionRequired && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="default" 
                              className="flex-1"
                              onClick={() => handleTakeAction(notification)}
                            >
                              {t.takeAction}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => handleViewDetails(notification)}
                            >
                              {t.viewDetails}
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
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="text-lg font-semibold mb-2">{t.noNotifications}</h3>
              <p className="text-muted-foreground">
                {t.noNotificationsMsg}
              </p>
              <Button 
                onClick={() => navigate('/home')}
                className="mt-4"
              >
                {t.findJobs}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick actions */}
        {notifications.some(n => n.actionRequired) && (
          <Card className="shadow-soft mt-6 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-card-foreground">
                    {t.actionsRequired}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {notifications.filter(n => n.actionRequired).length} {t.itemsNeedAttention}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  {t.review}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;