import React, { useRef } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: () => void;
  handleInputChange: (value: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  handleSendMessage,
  handleInputChange,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-shrink-0 p-3 sm:p-4 border-t border-border bg-background">
      <div className="flex items-end space-x-2 max-w-4xl mx-auto">
        <Input
          className="flex-1 min-h-[44px] bg-muted/50 border-none resize-none px-4 py-3 rounded-xl focus-visible:ring-1"
          placeholder="Введите сообщение..."
          value={newMessage}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          className="h-[44px] w-[44px] rounded-xl shrink-0"
          disabled={!newMessage.trim()}
          size="icon"
          variant="default"
          onClick={handleSendMessage}
        >
          <Send className={newMessage.trim() ? "ml-1" : ""} size={18} />
        </Button>
      </div>
    </div>
  );
};
