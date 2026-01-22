import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, Send, User, Building2, 
  MessageSquare, Phone, Video 
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'worker' | 'company';
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Chat {
  id: string;
  participantName: string;
  participantType: 'worker' | 'company';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  jobTitle?: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speak, isSupported } = useVoiceAssistant();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [userType, setUserType] = useState<'worker' | 'company'>('worker');

  const [chats] = useState<Chat[]>([
    {
      id: '1',
      participantName: 'QuickEats',
      participantType: 'company',
      lastMessage: 'When can you start working?',
      lastMessageTime: '2 min ago',
      unreadCount: 2,
      jobTitle: 'Delivery Partner',
    },
    {
      id: '2',
      participantName: 'CleanCorp',
      participantType: 'company',
      lastMessage: 'Your application has been approved!',
      lastMessageTime: '1 hour ago',
      unreadCount: 0,
      jobTitle: 'Office Cleaner',
    },
    {
      id: '3',
      participantName: 'Rajesh Kumar',
      participantType: 'worker',
      lastMessage: 'I have 2 years of delivery experience',
      lastMessageTime: '3 hours ago',
      unreadCount: 1,
      jobTitle: 'Delivery Partner',
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'company1',
      senderName: 'QuickEats HR',
      senderType: 'company',
      content: 'Hello! Thank you for applying to our Delivery Partner position.',
      timestamp: '10:30 AM',
      isRead: true,
    },
    {
      id: '2',
      senderId: 'worker1',
      senderName: 'You',
      senderType: 'worker',
      content: 'Thank you for considering my application. I am very interested in this position.',
      timestamp: '10:32 AM',
      isRead: true,
    },
    {
      id: '3',
      senderId: 'company1',
      senderName: 'QuickEats HR',
      senderType: 'company',
      content: 'Great! Can you tell me about your delivery experience?',
      timestamp: '10:35 AM',
      isRead: true,
    },
    {
      id: '4',
      senderId: 'worker1',
      senderName: 'You',
      senderType: 'worker',
      content: 'I have been working as a delivery partner for 2 years. I have my own bike and know the city well.',
      timestamp: '10:37 AM',
      isRead: true,
    },
    {
      id: '5',
      senderId: 'company1',
      senderName: 'QuickEats HR',
      senderType: 'company',
      content: 'Perfect! When can you start working?',
      timestamp: '2 min ago',
      isRead: false,
    },
  ]);

  useEffect(() => {
    // Determine user type from localStorage or URL
    const storedUserType = localStorage.getItem('userType') as 'worker' | 'company';
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'currentUser',
      senderName: 'You',
      senderType: userType,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    if (isSupported) {
      speak('Message sent');
    }
  };

  const handleBackNavigation = () => {
    navigate('/home');
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className={`${userType === 'company' ? 'bg-gradient-accent' : 'bg-gradient-primary'} text-white p-6`}>
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleBackNavigation}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{t.messages}</h1>
            {selectedChatData && (
              <p className="text-white/80">
                {selectedChatData.participantName}
                {selectedChatData.jobTitle && ` • ${selectedChatData.jobTitle}`}
              </p>
            )}
          </div>
          {selectedChatData && (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Phone className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Video className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Chat List */}
        <div className="w-full md:w-1/3 border-r border-border">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Conversations</h2>
            <div className="space-y-2">
              {chats.map((chat) => (
                <Card
                  key={chat.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedChat === chat.id ? 'bg-muted border-primary' : ''
                  }`}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        chat.participantType === 'company' 
                          ? 'bg-accent/10' 
                          : 'bg-primary/10'
                      }`}>
                        {chat.participantType === 'company' ? (
                          <Building2 className={`w-5 h-5 ${
                            chat.participantType === 'company' ? 'text-accent' : 'text-primary'
                          }`} />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{chat.participantName}</h3>
                          <span className="text-xs text-muted-foreground">
                            {chat.lastMessageTime}
                          </span>
                        </div>
                        {chat.jobTitle && (
                          <p className="text-xs text-muted-foreground mb-1">
                            {chat.jobTitle}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage}
                          </p>
                          {chat.unreadCount > 0 && (
                            <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderName === 'You' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderName === 'You'
                            ? userType === 'company'
                              ? 'bg-accent text-accent-foreground'
                              : 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderName === 'You'
                            ? 'text-white/70'
                            : 'text-muted-foreground'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={t.typeMessage}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={userType === 'company' ? 'bg-accent hover:bg-accent-hover' : ''}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* No Messages State */}
      {chats.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <Card className="shadow-soft max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t.noMessages}</h3>
              <p className="text-muted-foreground mb-4">
                {userType === 'company' 
                  ? 'When workers apply for your jobs, you can message them here.'
                  : 'When you apply for jobs, you can message employers here.'
                }
              </p>
              <Button
                onClick={() => navigate('/home')}
              >
                {t.findJobs}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Messages;