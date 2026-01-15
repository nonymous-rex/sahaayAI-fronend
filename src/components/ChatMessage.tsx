import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-2xl max-w-[85%] animate-in slide-in-from-bottom-2 duration-300",
        isUser 
          ? "ml-auto bg-primary text-primary-foreground" 
          : "mr-auto bg-card shadow-soft border border-border"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-primary-foreground/20" : "bg-primary/10"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className={cn("w-4 h-4", !isUser && "text-primary")} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-relaxed break-words">{message.content}</p>
        <span
          className={cn(
            "text-[10px] mt-1 block",
            isUser ? "text-primary-foreground/60" : "text-muted-foreground"
          )}
        >
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </div>
  );
}
