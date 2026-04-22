import type { Message } from "@/src/features/chat/types";

import React, { useRef, useEffect } from "react";
import { Avatar } from "@heroui/react";

interface ChatMessageListProps {
  messages: Message[];
  currentUserId?: string;
  typingUsers?: { userId: string; userName: string }[];
  formatMessageTime: (date: string) => string;
  isGroup?: boolean;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentUserId,
  typingUsers = [],
  formatMessageTime,
  isGroup = false,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  return (
    <div className="flex-1 overflow-y-auto p-2.5 space-y-2 bg-muted/20 pb-3 relative">
      <div className="flex justify-center mb-3 pt-1">
        <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
          Начало переписки
        </span>
      </div>

      {messages.map((message, index) => {
        const isOwn = message.senderId === currentUserId;
        const isLastInGroup =
          index === messages.length - 1 ||
          messages[index + 1]?.senderId !== message.senderId;
        const isFirstInGroup =
          index === 0 || messages[index - 1]?.senderId !== message.senderId;

        return (
          <div
            key={message.id}
            className={`flex gap-2 items-end ${isOwn ? "justify-end" : "justify-start"} ${!isLastInGroup && isGroup ? "mb-px" : "mb-1.5"}`}
          >
            {!isOwn && isGroup ? (
              isLastInGroup ? (
                <Avatar
                  className="flex-shrink-0 w-7 h-7 rounded-full mb-0.5"
                  icon={<div />}
                  name={message.sender?.name?.[0] || "?"}
                  src={message.sender?.avatarUrl || undefined}
                />
              ) : (
                <div className="w-7 flex-shrink-0" />
              )
            ) : null}

            <div
              className={`max-w-[82%] lg:max-w-[68%] px-3 py-1.5 relative group ${
                isOwn
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                  : "bg-background border shadow-sm text-foreground rounded-2xl rounded-bl-sm"
              }`}
            >
              {!isOwn && isGroup && message.sender?.name && isFirstInGroup && (
                <div className="text-[11px] font-semibold text-primary mb-0.5 opacity-80">
                  {message.sender.name}
                </div>
              )}
              <div className="break-words leading-snug text-sm">
                {message.content}
              </div>
              <div
                className={`text-[10px] mt-0.5 flex items-center justify-end gap-1 ${
                  isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {formatMessageTime(message.createdAt)}
                {isOwn && (
                  <span
                    className={
                      message.isRead ? "text-primary-foreground" : "opacity-50"
                    }
                  >
                    {message.isRead ? "✓✓" : "✓"}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {typingUsers.length > 0 && (
        <div className="flex justify-start">
          <div className="bg-background border shadow-sm px-3 py-1.5 rounded-2xl rounded-bl-sm">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="font-medium">
                {typingUsers.map((user) => user.userName).join(", ")}
              </span>
              <span>печатает</span>
              <span className="flex gap-0.5 mt-1">
                <span
                  className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1 h-1 bg-muted-foreground/60 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} className="h-2" />
    </div>
  );
};
