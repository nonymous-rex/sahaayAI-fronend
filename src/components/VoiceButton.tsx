import { cn } from "@/lib/utils";
import { Mic, MicOff, Loader2 } from "lucide-react";

interface VoiceButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  onClick: () => void;
}

export function VoiceButton({ isConnected, isConnecting, isSpeaking, onClick }: VoiceButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isConnecting}
      className={cn(
        "relative w-32 h-32 rounded-full transition-all duration-300",
        "flex items-center justify-center",
        "focus:outline-none focus:ring-4 focus:ring-primary/30",
        isConnected 
          ? "bg-gradient-nature shadow-glow" 
          : "bg-primary hover:bg-primary/90 shadow-elevated",
        isConnecting && "opacity-70 cursor-wait",
        !isConnected && !isConnecting && "animate-voice-pulse"
      )}
    >
      {/* Ripple effect when speaking */}
      {isSpeaking && (
        <>
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <span className="absolute inset-[-8px] rounded-full border-2 border-primary/30 animate-pulse" />
        </>
      )}
      
      {/* Icon */}
      {isConnecting ? (
        <Loader2 className="w-12 h-12 text-primary-foreground animate-spin" />
      ) : isConnected ? (
        <MicOff className="w-12 h-12 text-primary-foreground" />
      ) : (
        <Mic className="w-12 h-12 text-primary-foreground" />
      )}
    </button>
  );
}
