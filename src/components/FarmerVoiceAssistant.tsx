import { useState, useCallback, useRef, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { VoiceButton } from "./VoiceButton";
import { VoiceWaveform } from "./VoiceWaveform";
import { ChatMessage, Message } from "./ChatMessage";
import { QuickActionCard } from "./QuickActionCard";
import { WeatherWidget } from "./WeatherWidget";
import { useToast } from "@/hooks/use-toast";
import { 
  Sprout, 
  CloudRain, 
  Bug, 
  Calendar,
  Wheat,
  Tractor,
  ChevronDown
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const QUICK_PROMPTS = [
  { icon: CloudRain, title: "Weather Forecast", description: "Ask about upcoming weather for your crops" },
  { icon: Bug, title: "Pest Control", description: "Get advice on managing pests naturally" },
  { icon: Sprout, title: "Planting Tips", description: "Best practices for current season" },
  { icon: Calendar, title: "Harvest Schedule", description: "When to harvest your crops" },
];

export function FarmerVoiceAssistant() {
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
        title: "Connected!",
        description: "Your farm assistant is ready to help.",
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from assistant");
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
        title: "Connection Error",
        description: "Failed to connect. Please check your Agent ID.",
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
        title: "Agent ID Required",
        description: "Please enter your ElevenLabs Agent ID to start.",
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
          title: "Microphone Access Required",
          description: "Please enable microphone access to use voice features.",
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
    <div className="min-h-screen bg-gradient-earth flex flex-col">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-nature rounded-xl flex items-center justify-center shadow-soft">
              <Wheat className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">Farm Assistant</h1>
              <p className="text-xs text-muted-foreground">Voice-powered farming help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tractor className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Agent ID Input */}
      {showAgentInput && !isConnected && (
        <div className="px-5 pb-4">
          <div className="bg-card rounded-2xl p-4 border border-border shadow-soft">
            <label className="text-sm font-medium text-foreground">ElevenLabs Agent ID</label>
            <input
              type="text"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              placeholder="Enter your Agent ID..."
              className="w-full mt-2 px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Create a public agent at elevenlabs.io/conversational-ai
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-5 overflow-hidden">
        {!isConnected && messages.length === 0 ? (
          // Welcome Screen
          <div className="flex-1 flex flex-col">
            <WeatherWidget />
            
            <div className="mt-6">
              <h2 className="font-display text-sm font-semibold text-foreground mb-3">
                Quick Questions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <QuickActionCard
                    key={i}
                    icon={prompt.icon}
                    title={prompt.title}
                    description={prompt.description}
                    onClick={() => {
                      if (!agentId) setShowAgentInput(true);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Chat Messages
          <ScrollArea className="flex-1 -mx-5 px-5">
            <div className="space-y-3 py-4">
              {messages.length === 0 && isConnected && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">
                    Start speaking to ask your farming questions...
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

        {/* Scroll indicator */}
        {messages.length > 3 && (
          <div className="flex justify-center py-2">
            <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce" />
          </div>
        )}
      </main>

      {/* Voice Control Footer */}
      <footer className="px-5 pb-8 pt-4 safe-area-bottom">
        <div className="flex flex-col items-center">
          <VoiceButton
            isConnected={isConnected}
            isConnecting={isConnecting}
            isSpeaking={conversation.isSpeaking}
            onClick={handleVoiceClick}
          />
          <VoiceWaveform isActive={isConnected} isSpeaking={conversation.isSpeaking} />
          <p className="text-sm text-muted-foreground mt-3 text-center">
            {isConnecting 
              ? "Connecting..." 
              : isConnected 
                ? conversation.isSpeaking 
                  ? "Assistant is speaking..." 
                  : "Listening... Tap to end"
                : "Tap to start voice chat"
            }
          </p>
        </div>
      </footer>
    </div>
  );
}
