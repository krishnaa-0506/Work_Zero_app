import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MicOff, Mic, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const CallSupport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    // Simulate call connection
    const connectionTimer = setTimeout(() => {
      setCallStatus('connected');
      toast({
        title: 'Connected',
        description: 'You are now connected with a support agent',
      });
    }, 2000);

    return () => clearTimeout(connectionTimer);
  }, [toast]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setCallStatus('ended');
    toast({
      title: 'Call ended',
      description: `Call duration: ${formatDuration(callDuration)}`,
    });
    setTimeout(() => navigate('/support'), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col items-center justify-center p-4">
      {/* Call Status */}
      <div className="text-center mb-8">
        <Avatar className="h-24 w-24 mb-4 mx-auto ring-4 ring-white/20">
          <AvatarImage src="/support-agent.png" />
          <AvatarFallback className="text-2xl">SA</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-semibold mb-2">Support Agent</h1>
        <p className="text-white/80">
          {callStatus === 'connecting' && 'Connecting...'}
          {callStatus === 'connected' && formatDuration(callDuration)}
          {callStatus === 'ended' && 'Call ended'}
        </p>
      </div>

      {/* Call Controls */}
      <div className="flex items-center space-x-6">
        <Button
          variant="secondary"
          size="lg"
          className={`rounded-full p-6 ${
            isMuted ? 'bg-white/20' : 'bg-white'
          }`}
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <MicOff className={`h-6 w-6 ${isMuted ? 'text-white' : 'text-blue-600'}`} />
          ) : (
            <Mic className={`h-6 w-6 ${isMuted ? 'text-white' : 'text-blue-600'}`} />
          )}
        </Button>
        <Button
          variant="destructive"
          size="lg"
          className="rounded-full p-6 bg-red-500 hover:bg-red-600"
          onClick={handleEndCall}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>

      {/* Connection Status */}
      {callStatus === 'connecting' && (
        <div className="mt-8 flex items-center space-x-2">
          <div className="animate-pulse">
            <Phone className="h-5 w-5" />
          </div>
          <p>Connecting to support...</p>
        </div>
      )}
    </div>
  );
};

export default CallSupport;
