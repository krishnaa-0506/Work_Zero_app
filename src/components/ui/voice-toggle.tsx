import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceToggleProps {
  enabled: boolean;
  onToggle: () => void;
  isSupported: boolean;
}

export const VoiceToggle = ({ enabled, onToggle, isSupported }: VoiceToggleProps) => {
  return (
    <div className="fixed right-4 bottom-24 z-40 flex items-center gap-2">
      <Button
        size="icon"
        variant={enabled ? "default" : "secondary"}
        className="h-12 w-12 rounded-full shadow-lg"
        onClick={onToggle}
        aria-label={enabled ? "Disable voice playback" : "Enable voice playback"}
        disabled={!isSupported}
      >
        {enabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </Button>
      <div className="hidden sm:flex flex-col text-xs text-muted-foreground">
        <span>{isSupported ? "Screen reader" : "Voice not supported"}</span>
        <span className="font-semibold text-foreground">{enabled ? "On" : "Off"}</span>
      </div>
    </div>
  );
};
