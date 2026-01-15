import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  variant?: "default" | "accent";
}

export function QuickActionCard({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
  variant = "default" 
}: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-start gap-4 p-4 rounded-2xl text-left transition-all duration-200",
        "hover:scale-[1.02] active:scale-[0.98]",
        variant === "default" 
          ? "bg-card border border-border shadow-soft hover:shadow-elevated" 
          : "bg-gradient-nature text-primary-foreground shadow-elevated"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          variant === "default" ? "bg-primary/10" : "bg-primary-foreground/20"
        )}
      >
        <Icon className={cn(
          "w-5 h-5",
          variant === "default" ? "text-primary" : "text-primary-foreground"
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "font-display font-semibold text-sm",
          variant === "default" ? "text-foreground" : "text-primary-foreground"
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-xs mt-0.5 line-clamp-2",
          variant === "default" ? "text-muted-foreground" : "text-primary-foreground/80"
        )}>
          {description}
        </p>
      </div>
    </button>
  );
}
