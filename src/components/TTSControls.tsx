import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { useTTS } from '@/hooks/useTTS';

interface TTSControlsProps {
  className?: string;
}

export const TTSControls: React.FC<TTSControlsProps> = ({ className = '' }) => {
  const { speak, stop, pause, resume, isSpeaking, isPaused, isSupported } = useTTS();

  if (!isSupported) {
    return null;
  }

  const handleReadPage = () => {
    const content = document.querySelector('main')?.textContent || document.body.textContent || '';
    const cleanContent = content
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 500);
    
    if (cleanContent) {
      speak(`📱 Reading page content: ${cleanContent}`);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {!isSpeaking ? (
        <Button
          onClick={handleReadPage}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Volume2 className="h-4 w-4" />
          🔊 Read Page
        </Button>
      ) : (
        <div className="flex gap-1">
          {!isPaused ? (
            <Button
              onClick={pause}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Pause className="h-4 w-4" />
              ⏸️ Pause
            </Button>
          ) : (
            <Button
              onClick={resume}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Play className="h-4 w-4" />
              ▶️ Resume
            </Button>
          )}
          <Button
            onClick={stop}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <VolumeX className="h-4 w-4" />
            🔇 Stop
          </Button>
        </div>
      )}
    </div>
  );
};