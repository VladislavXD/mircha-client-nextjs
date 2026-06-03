"use client";
import type { Message } from "@/src/features/chat/types";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useGetGroupById, useMarkMessagesAsRead } from "@/src/features/chat";
import { socketService } from "@/src/socket/socketService";
import { useProfile } from "@/src/features/profile";
import {
  ChatHeader,
  ChatMessageList,
  ChatInput,
} from "@/src/features/chat/components";

export const GroupChatWindow: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();
  const { user: currentUser } = useProfile();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<
    { userId: string; userName: string }[]
  >([]);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: chatData, isLoading } = useGetGroupById(groupId, {
    enabled: !!groupId,
  });
  const { mutate: markAsRead } = useMarkMessagesAsRead();

  useEffect(() => {
    if (chatData?.id) {
      socketService.joinGroupChat(chatData.id);
      setMessages(chatData.messages || []);

      const unreadMessageIds =
        chatData.messages
          ?.filter(
            (msg: Message) => !msg.isRead && msg.senderId !== currentUser?.id,
          )
          .map((msg: Message) => msg.id) || [];

      if (unreadMessageIds.length > 0) {
        markAsRead(chatData.id);
      }
    }
  }, [chatData, currentUser?.id, markAsRead]);

  // Socket.IO event handlers
  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      if (message.chatId === chatData?.id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleTypingStart = (data: {
      userId: string;
      userName: string;
      chatId: string;
    }) => {
      if (data.chatId === chatData?.id && data.userId !== currentUser?.id) {
        setTypingUsers((prev) => {
          const exists = prev.find((user) => user.userId === data.userId);

          if (!exists)
            return [...prev, { userId: data.userId, userName: data.userName }];

          return prev;
        });
      }
    };

    const handleTypingStop = (data: { userId: string; chatId: string }) => {
      if (data.chatId === chatData?.id) {
        setTypingUsers((prev) =>
          prev.filter((user) => user.userId !== data.userId),
        );
      }
    };

    const handleMessagesRead = (data: { chatId: string; readerId: string }) => {
      if (data.chatId === chatData?.id && data.readerId !== currentUser?.id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === currentUser?.id && !msg.isRead
              ? { ...msg, isRead: true }
              : msg,
          ),
        );
      }
    };

    socketService.onNewGroupMessage(handleNewMessage);
    socketService.onTypingStart(handleTypingStart);
    socketService.onTypingStop(handleTypingStop);
    socketService.onMessagesRead(handleMessagesRead);

    return () => {
      socketService.off("new_group_message", handleNewMessage);
      socketService.off("user_typing_start", handleTypingStart);
      socketService.off("user_typing_stop", handleTypingStop);
      socketService.off("messages_read", handleMessagesRead);
    };
  }, [chatData?.id, currentUser?.id]);

  useEffect(() => {
    const handleWindowFocus = () => {
      if (chatData?.id && currentUser?.id) {
        const hasUnreadMessages = messages.some(
          (msg) => !msg.isRead && msg.senderId !== currentUser.id,
        );

        if (hasUnreadMessages) markAsRead(chatData.id);
      }
    };

    window.addEventListener("focus", handleWindowFocus);
    if (document.hasFocus() && chatData?.id && currentUser?.id) {
      handleWindowFocus();
    }

    return () => window.removeEventListener("focus", handleWindowFocus);
  }, [chatData?.id, currentUser?.id, messages, markAsRead]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !chatData?.id) return;
    socketService.sendGroupMessage(chatData.id, newMessage.trim());
    setNewMessage("");
    if (isTyping) {
      socketService.stopTypingGroup(chatData.id);
      setIsTyping(false);
    }
  };

  const handleInputChange = (value: string) => {
    setNewMessage(value);
    if (!chatData?.id) return;

    if (value.trim() && !isTyping) {
      socketService.startTypingGroup(chatData.id);
      setIsTyping(true);
    } else if (!value.trim() && isTyping) {
      socketService.stopTypingGroup(chatData.id);
      setIsTyping(false);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (value.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        if (isTyping) {
          socketService.stopTypingGroup(chatData.id);
          setIsTyping(false);
        }
      }, 3000);
    }
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const diffInHours =
      (new Date().getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24)
      return date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      });

    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full bg-background">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  if (!chatData) {
    return (
      <div className="flex justify-center items-center h-full w-full bg-background">
        <div className="text-destructive font-medium">Ошибка загрузки чата</div>
      </div>
    );
  }

  const groupName = chatData.name || "Безымянная группа";
  const groupAvatar = chatData.avatarUrl || undefined;
  const participantCount = Array.isArray(chatData.participants)
    ? chatData.participants.length
    : 0;

  return (
    <div className="flex flex-col bg-background h-full w-full">
      <ChatHeader
        avatarUrl={groupAvatar}
        description={`${participantCount} участник(ов)`}
        name={groupName}
        onBack={() => router.push("/chat")}
      />
      <ChatMessageList
        currentUserId={currentUser?.id}
        formatMessageTime={formatMessageTime}
        isGroup={true}
        messages={messages}
        typingUsers={typingUsers}
      />
      <ChatInput
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
      />
    </div>
  );
};
