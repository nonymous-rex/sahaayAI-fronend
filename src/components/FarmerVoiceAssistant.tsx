import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConversation } from "@elevenlabs/react";
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

const QUICK_PROMPTS = [
  {
    icon: CloudRain,
    title: "Weather",
    description: "Today's forecast",
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600"
  },
  {
    icon: Bug,
    title: "Pest Help",
    description: "Control pests",
    color: "from-red-400 to-orange-500",
    bgColor: "bg-red-50",
    textColor: "text-red-600"
  },
  {
    icon: Sprout,
    title: "Planting",
    description: "Best tips",
    color: "from-green-400 to-green-600",
    bgColor: "bg-green-50",
    textColor: "text-green-600"
  },
  {
    icon: Calendar,
    title: "Harvest",
    description: "Right timing",
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600"
  },
];

export function FarmerVoiceAssistant() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [agentId, setAgentId] = useState<string>("");
  const [showAgentInput, setShowAgentInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to farm assistant");
      toast({
        title: "Ready to help!",
        description: "I'm here to answer your farming questions.",
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from assistant");
      toast({
        title: "Disconnected",
        description: "Tap the button again when you need me.",
      });
    },
    onMessage: (message: any) => {
      if (message.type === "user_transcript" && message.user_transcription_event?.user_transcript) {
        const newMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          content: message.user_transcription_event.user_transcript,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
      if (message.type === "agent_response" && message.agent_response_event?.agent_response) {
        const newMessage: Message = {
          id: Date.now().toString() + "-agent",
          role: "assistant",
          content: message.agent_response_event.agent_response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        variant: "destructive",
        title: "Connection Problem",
        description: "Can't connect right now. Please try again.",
      });
      setIsConnecting(false);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = useCallback(async () => {
    if (!agentId.trim()) {
      setShowAgentInput(true);
      toast({
        title: "Setup Needed",
        description: "Please enter your ID to get started.",
      });
      return;
    }

    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      await conversation.startSession({
        agentId: agentId.trim(),
        connectionType: "webrtc",
      });
    } catch (error: any) {
      console.error("Failed to start:", error);
      if (error.name === "NotAllowedError") {
        toast({
          variant: "destructive",
          title: "Need Microphone",
          description: "Please allow microphone access to talk.",
        });
      }
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, agentId, toast]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const handleVoiceClick = () => {
    if (conversation.status === "connected") {
      stopConversation();
    } else {
      startConversation();
    }
  };

  const isConnected = conversation.status === "connected";

  return (
    <div 
      className="min-h-screen min-h-[100dvh] bg-gradient-earth flex flex-col"
      role="application"
      aria-label="Farm Voice Assistant"
    >
      <header className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 px-6 pt-8 pb-10 safe-area-top rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
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

      {showAgentInput && !isConnected && (
        <div className="px-5 -mt-4 relative z-10 animate-slide-up">
          <div className="bg-white rounded-3xl p-6 border-2 border-green-200 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <span className="text-2xl">🔑</span>
              </div>
              <div>
                <label
                  htmlFor="agent-id-input"
                  className="text-lg font-display font-bold text-gray-800 block"
                >
                  Setup Required
                </label>
                <p className="text-sm text-gray-600">Enter your ID to begin</p>
              </div>
            </div>
            <input
              id="agent-id-input"
              type="text"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="Paste your ID here..."
              aria-describedby="agent-id-help"
              className={cn(
                "w-full px-5 py-4 rounded-2xl text-base",
                "bg-gray-50 border-2 border-gray-200",
                "text-gray-800 placeholder:text-gray-400",
                "focus:outline-none focus:border-green-500 focus:bg-white",
                "transition-all duration-200"
              )}
            />
            <p id="agent-id-help" className="text-sm text-gray-600 mt-3 leading-relaxed">
              Get your ID from{" "}
              <span className="text-green-600 font-semibold">elevenlabs.io</span>
            </p>
          </div>
        </div>
      )}

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
                    if (!agentId) setShowAgentInput(true);
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
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        )}
      </main>

      {/* Voice Control Footer */}
      <footer 
        className="px-5 pb-6 pt-4 safe-area-bottom bg-gradient-to-t from-background to-transparent"
        role="region"
        aria-label="Voice controls"
      >
        <div className="flex flex-col items-center">
          <VoiceButton
            isConnected={isConnected}
            isConnecting={isConnecting}
            isSpeaking={conversation.isSpeaking}
            onClick={handleVoiceClick}
          />
          <VoiceWaveform isActive={isConnected} isSpeaking={conversation.isSpeaking} />
          <div className="mt-4 text-center">
            <p
              className="text-lg font-bold text-gray-800"
              role="status"
              aria-live="polite"
            >
              {isConnecting
                ? "Getting ready..."
                : isConnected
                ? conversation.isSpeaking
                  ? "I'm speaking..."
                  : "I'm listening..."
                : "Tap to talk"}
            </p>
            {!isConnecting && (
              <p className="text-sm text-gray-600 mt-1 font-medium">
                {isConnected ? "Tap button to stop" : "Press the big button above"}
              </p>
            )}
          </div>
        </div>
      </footer>

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />
    </div>
  );
}
