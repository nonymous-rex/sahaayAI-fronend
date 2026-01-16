import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { VoiceButton } from "./VoiceButton";
import { VoiceWaveform } from "./VoiceWaveform";
import { ChatMessage, Message } from "./ChatMessage";
import { QuickActionCard } from "./QuickActionCard";
import { WeatherWidget } from "./WeatherWidget";
import { AccessibilityToolbar } from "./AccessibilityToolbar";
import { useToast } from "@/hooks/use-toast";
import {
  Sprout,
  CloudRain,
  Bug,
  Calendar,
  Leaf,
  Settings,
  UserCircle
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

const QUICK_PROMPTS = [
  {
    icon: CloudRain,
    title: "Weather",
    description: "Today's forecast",
    color: "from-cyan-500 to-teal-600",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-600"
  },
  {
    icon: Bug,
    title: "Pest Help",
    description: "Control pests",
    color: "from-rose-400 to-orange-500",
    bgColor: "bg-rose-50",
    textColor: "text-rose-600"
  },
  {
    icon: Sprout,
    title: "Planting",
    description: "Best tips",
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-teal-50",
    textColor: "text-teal-600"
  },
  {
    icon: Calendar,
    title: "Harvest",
    description: "Right timing",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600"
  },
];

export function FarmerVoiceAssistant() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isVoiceActiveRef = useRef(false);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true; // Enable interim results
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        console.log('Speech recognition result received');
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;
          console.log(`Result ${i}: "${transcript}" (isFinal: ${result.isFinal})`);

          if (result.isFinal) {
            setTranscript(prev => prev + transcript + ' ');
          }
        }
      };

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsSpeaking(true);
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsSpeaking(false);
        // Don't restart automatically - let user control it
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          variant: "destructive",
          title: "Voice Recognition Error",
          description: `Error: ${event.error}`,
        });
        setIsVoiceActive(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startVoice = useCallback(async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      toast({
        variant: "destructive",
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition.",
      });
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      setTranscript("");
      setIsVoiceActive(true);
      isVoiceActiveRef.current = true;

      if (recognitionRef.current) {
        console.log('Starting speech recognition...');
        recognitionRef.current.start();
        console.log('Speech recognition start() called');
      } else {
        console.error('Recognition ref is null');
      }

      toast({
        title: "Voice Active",
        description: "Voice assistant is now listening.",
      });
    } catch (error) {
      console.error("Failed to start voice:", error);
      toast({
        variant: "destructive",
        title: "Microphone Access Needed",
        description: "Please allow microphone access to use voice features.",
      });
    }
  }, [toast]);

  const stopVoice = useCallback(async () => {
    setIsVoiceActive(false);
    isVoiceActiveRef.current = false;
    setIsSpeaking(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const finalTranscript = transcript.trim();
    if (finalTranscript) {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: finalTranscript,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      console.log("What you said:", finalTranscript);

      // Submit transcript to API
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}`, {
          query: finalTranscript,
          timestamp: new Date().toISOString(),
        });

        // Add assistant response
        if (response.data && response.data.response) {
          const assistantMessage: Message = {
            id: Date.now().toString() + '_assistant',
            role: "assistant",
            content: response.data.response,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }

        console.log("Transcript submitted successfully");
      } catch (error: any) {
        console.error("Failed to submit transcript:", error);
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "Failed to submit your message. Please try again.",
        });
      }
    } else {
      console.log("No speech detected");
    }
    
    toast({
      title: "Voice Stopped",
      description: `Captured: "${finalTranscript || 'No speech detected'}"`,
    });

    setTranscript("");
  }, [toast, transcript]);

  const handleVoiceClick = () => {
    if (isVoiceActive) {
      stopVoice();
    } else {
      startVoice();
    }
  };

  const isConnected = isVoiceActive;

  return (
    <div 
      className="min-h-screen min-h-[100dvh] bg-gradient-earth flex flex-col"
      role="application"
      aria-label="Farm Voice Assistant"
    >
      <header className="bg-gradient-to-br from-cyan-600 via-teal-600 to-blue-700 px-6 pt-8 pb-10 safe-area-top rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS1vcGFjaXR5PSIuMSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-10" />

        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg animate-float"
              aria-hidden="true"
            >
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white drop-shadow-lg">
                Farm Helper
              </h1>
              <p className="text-sm text-white/90 font-medium">
                Talk to me anytime
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/signin")}
            aria-label="Sign in to your account"
            className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <UserCircle className="w-6 h-6 text-white" aria-hidden="true" />
          </button>
        </div>

        <WeatherWidget />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-5 pt-6 overflow-hidden" role="main">
        {!isConnected && messages.length === 0 ? (
          <div className="flex-1 flex flex-col animate-fade-in">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-gray-800 mb-2 leading-tight">
                What can I help with?
              </h2>
              <p className="text-gray-600 text-base font-medium">
                Just tap what you need or speak to me
              </p>
            </div>
            
            <div
              className="grid grid-cols-2 gap-4"
              role="list"
              aria-label="Quick action topics"
            >
              {QUICK_PROMPTS.map((prompt, i) => (
                <QuickActionCard
                  key={i}
                  icon={prompt.icon}
                  title={prompt.title}
                  description={prompt.description}
                  color={prompt.color}
                  bgColor={prompt.bgColor}
                  textColor={prompt.textColor}
                  onClick={() => {
                    // Quick action clicked
                  }}
                  delay={i * 100}
                />
              ))}
            </div>

            <div className="mt-auto space-y-4">
              <div className="relative p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-200/50 shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow-md">
                      <span className="text-2xl">💡</span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-amber-900">
                      Quick Tips
                    </h3>
                  </div>
                  <ul className="space-y-2" role="list">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">✓</span>
                      <span className="text-amber-900 text-sm font-medium">Speak naturally like talking to a friend</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">✓</span>
                      <span className="text-amber-900 text-sm font-medium">Ask about weather, crops, or pests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">✓</span>
                      <span className="text-amber-900 text-sm font-medium">Tap the big green button to start</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Chat Messages
          <ScrollArea className="flex-1 -mx-5 px-5" aria-label="Conversation history">
            <div className="space-y-4 py-4" role="log" aria-live="polite">
              {messages.length === 0 && isConnected && (
                <div className="text-center py-12 animate-fade-in" role="status">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse-slow">
                    <Leaf className="w-10 h-10 text-white" aria-hidden="true" />
                  </div>
                  <p className="text-gray-800 text-xl font-bold mb-1">
                    I'm listening...
                  </p>
                  <p className="text-gray-600 text-base mt-2">
                    Go ahead, ask me anything
                  </p>
                </div>
              )}
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </main>

      {/* Voice Control Footer */}
      <footer
        className={cn(
          "relative px-5 pb-6 pt-4 safe-area-bottom bg-gradient-to-t from-background to-transparent overflow-visible",
          isSpeaking && "pb-12"
        )}
        role="region"
        aria-label="Voice controls"
      >
        {/* Wavy bottom glow when speaking */}
        {isSpeaking && (
          <div className="absolute left-0 right-0 -bottom-12 flex justify-center pointer-events-none">
            <div className="relative w-full max-w-lg h-16">
              {/* Main glow wave */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-700/70 via-blue-600/50 to-transparent rounded-t-full blur-xl animate-pulse" />
              {/* Secondary wave for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-800/50 via-blue-700/30 to-transparent rounded-t-full blur-2xl animate-pulse delay-300" />
              {/* Animated wave lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 64" fill="none">
                <path
                  d="M0 64 Q100 20 200 64 T400 64 V64 H0 Z"
                  fill="url(#waveGradient)"
                  className="animate-wave-flow"
                />
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="rgb(29 78 216 / 0.9)" />
                    <stop offset="50%" stopColor="rgb(59 130 246 / 0.6)" />
                    <stop offset="100%" stopColor="rgb(59 130 246 / 0)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center relative z-10">
          <VoiceButton
            isConnected={isConnected}
            isConnecting={false}
            isSpeaking={isSpeaking}
            onClick={handleVoiceClick}
          />
          <VoiceWaveform isActive={isConnected} isSpeaking={isSpeaking} />
          <div className="mt-4 text-center">
            <p
              className="text-lg font-bold text-gray-800"
              role="status"
              aria-live="polite"
            >
              {isConnected ? (isSpeaking ? "I'm speaking..." : "Voice Active") : "Tap to talk"}
            </p>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              {isConnected ? "Tap button to stop" : "Press the big button above"}
            </p>
          </div>
        </div>
      </footer>

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />
    </div>
  );
}
