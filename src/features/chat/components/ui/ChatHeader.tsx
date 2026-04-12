import React from "react";
import { ArrowLeft, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnlineBadge } from "@/src/features/chat/components";

interface ChatHeaderProps {
  onBack: () => void;
  avatarUrl?: string;
  name: string;
  isOnline?: boolean;
  description?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onBack,
  avatarUrl,
  name,
  isOnline = false,
  description,
}) => {
  return (
    <div className="flex-shrink-0 p-3 sm:p-4 border-b border-border bg-background flex items-center justify-between z-10 shadow-sm">
      <div className="flex items-center space-x-3">
        <Button
          className="md:hidden text-muted-foreground mr-1"
          size="icon"
          variant="ghost"
          onClick={onBack}
        >
          <ArrowLeft size={20} />
        </Button>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <OnlineBadge
              avatarUrl={avatarUrl}
              description={description}
              isOnline={isOnline}
              name={name}
              size="md"
            />
          </div>
        </div>
      </div>

      <div className="space-x-1 sm:space-x-2 text-muted-foreground hidden sm:flex">
        <Button size="icon" variant="ghost">
          <Phone size={20} />
        </Button>
        <Button size="icon" variant="ghost">
          <Video size={20} />
        </Button>
      </div>
    </div>
  );
};
