import { Shield, User, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VerifiedBadgeProps {
  isAnonymous?: boolean;
  isMagicLink?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function VerifiedBadge({
  isAnonymous = false,
  isMagicLink = false,
  className,
  size = "md",
}: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Magic Link badge
  if (isMagicLink) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
                "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
                textSizeClasses[size],
                className
              )}
            >
              <LinkIcon className={sizeClasses[size]} />
              <span className="font-medium">Magic Link</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>This review was submitted via a personalized magic link</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Anonymous badge
  if (isAnonymous) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
                "bg-muted text-muted-foreground border border-border",
                textSizeClasses[size],
                className
              )}
            >
              <User className={sizeClasses[size]} />
              <span className="font-medium">Guest</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>This review was submitted anonymously</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Verified (Google) badge
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5",
              "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
              textSizeClasses[size],
              className
            )}
          >
            <Shield className={cn(sizeClasses[size], "fill-current")} />
            <span className="font-medium">Verified</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>This review was submitted by a verified Google account</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
