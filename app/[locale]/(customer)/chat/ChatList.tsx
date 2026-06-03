"use client";

import type { Chat } from "@/src/features/chat/types";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  MessageCircle,
  Users,
  Loader2,
  Search,
  User,
  UsersRound,
  Hash,
  Mic,
  MessageSquare,
} from "lucide-react";

import { socketService } from "../../../../src/socket/socketService";
import { formatChatTime } from "../../../utils/formatChatTime";

import { OnlineBadge } from "@/src/features/chat/components";
import { useOnlineStatuses } from "@/src/features/chat/hooks/useOnlineStatus";
import { useGetUserChats, useGetUserGroups } from "@/src/features/chat";
import NotAuthenticated from "@/shared/components/ui/notAuthenticated";
import { queryClient } from "@/lib/queryClient";
import { User as UserType } from "@/src/types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ChatListProps {
  isCollapsed?: boolean;
}

export const ChatList: React.FC<ChatListProps> = ({ isCollapsed = false }) => {
  const router = useRouter();
  const params = useParams();
  const activeUserId = params?.userId as string | undefined;

  const current = queryClient.getQueryData<UserType>(["profile"]);
  const {
    data: chats,
    isLoading: isChatsLoading,
    error: chatsError,
    refetch: refetchChats,
  } = useGetUserChats();
  const {
    data: groups,
    isLoading: isGroupsLoading,
    error: groupsError,
    refetch: refetchGroups,
  } = useGetUserGroups();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const isLoading =
    activeTab === "all"
      ? isChatsLoading || isGroupsLoading
      : activeTab === "personal"
        ? isChatsLoading
        : isGroupsLoading;
  const error =
    activeTab === "all"
      ? chatsError || groupsError
      : activeTab === "personal"
        ? chatsError
        : groupsError;

  const refetch = () => {
    refetchChats();
    refetchGroups();
  };

  const userIds = useMemo(() => {
    return (
      chats?.map((chat) => chat.otherParticipant?.id).filter(Boolean) || []
    );
  }, [chats]);

  const { getStatus } = useOnlineStatuses(userIds);

  useEffect(() => {
    if (!current?.id) return;
    const handleNewMessage = () => refetch();

    socketService.onNewMessage(handleNewMessage);

    return () => {
      socketService.off("new_message", handleNewMessage);
    };
  }, [current?.id, refetch]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && current?.id) {
        refetch();
        if (!socketService.connected) {
          socketService.connect().catch(console.error);
        }
      }
    };
    const handleFocus = () => {
      if (current?.id) {
        refetch();
        if (!socketService.connected) {
          socketService.connect().catch(console.error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [current?.id, refetch]);

  const handleChatClick = (chat: Chat) => {
    if (chat.type === "GROUP" || chat.type === "CHANNEL") {
      router.push(`/chat/group/${chat.id}`);
    } else {
      router.push(`/chat/${chat.otherParticipant?.id}`);
    }
  };

  const filteredChats = useMemo(() => {
    let sourceData: Chat[] = [];
    const personalChats = (chats || []).filter(
      (chat) => !chat.type || chat.type === "DIRECT",
    );

    if (activeTab === "all") {
      // Объединяем личные чаты и группы, сортируем по свежести сообщений
      sourceData = [...personalChats, ...(groups || [])].sort((a, b) => {
        const timeA = new Date(a.lastMessageAt || a.createdAt).getTime();
        const timeB = new Date(b.lastMessageAt || b.createdAt).getTime();

        return timeB - timeA;
      });
    } else if (activeTab === "personal") {
      sourceData = personalChats;
    } else if (activeTab === "groups") {
      sourceData = groups || [];
    } else if (activeTab === "channels" || activeTab === "voice") {
      sourceData = []; // No channels implemented yet
    }

    if (!searchQuery.trim()) return sourceData;
    const query = searchQuery.toLowerCase();

    return sourceData.filter((chat) => {
      if (chat.type === "GROUP" || chat.type === "CHANNEL") {
        return chat.name?.toLowerCase().includes(query);
      }

      return chat.otherParticipant?.name?.toLowerCase().includes(query);
    });
  }, [chats, groups, searchQuery, activeTab]);

  if (!current) {
    return <NotAuthenticated />;
  }
  // console.log('user chats', chats);

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      {/* Header and Search Area */}
      <div
        className={`border-b border-border shrink-0 min-w-0 transition-all duration-300 ${isCollapsed ? "p-2 space-y-2" : "p-3 sm:p-4 space-y-3"}`}
      >
        {!isCollapsed && (
          <div className="flex items-center justify-between min-w-0">
            <h1 className="text-xl font-bold tracking-tight">Сообщения</h1>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          {isCollapsed ? (
            <Button
              className="w-full h-10 bg-muted/30"
              size="icon"
              variant="ghost"
            >
              <Search className="h-5 w-5 text-muted-foreground" />
            </Button>
          ) : (
            <>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 h-9 bg-muted/50 border-none transition-colors hover:bg-muted focus-visible:ring-1 focus-visible:ring-ring focus-visible:bg-background"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </>
          )}
        </div>

        {/* Tabs */}
        {!isCollapsed && (
          <div className="w-full relative min-w-0">
            <Tabs
              className="w-full min-w-0"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-1 overflow-x-auto scrollbar-hide">
                <TabsTrigger
                  className="rounded-full px-3 py-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none bg-muted/40 hover:bg-muted"
                  value="all"
                >
                  <MessageSquare size={16} /> {/* "Все" таб */}
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-full px-3 py-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none bg-muted/40 hover:bg-muted"
                  value="personal"
                >
                  <User size={16} />
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-full px-3 py-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none bg-muted/40 hover:bg-muted"
                  value="groups"
                >
                  <UsersRound size={16} />
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-full px-3 py-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none bg-muted/40 hover:bg-muted"
                  value="channels"
                >
                  <Hash size={16} />
                </TabsTrigger>
                <TabsTrigger
                  className="rounded-full px-3 py-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none bg-muted/40 hover:bg-muted shrink-0"
                  value="voice"
                >
                  <Mic size={16} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>

      <div
        className={`flex-1 overflow-y-auto scrollbar-hide space-y-0.5 ${isCollapsed ? "p-1" : "p-2"}`}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-muted-foreground" size={32} />
          </div>
        ) : error ? (
          <div className="text-destructive text-center py-4 text-sm">
            {!isCollapsed && "Ошибка загрузки чатов"}
          </div>
        ) : !chats || chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 px-2 text-center">
            <MessageCircle
              className="text-muted-foreground/50"
              size={isCollapsed ? 28 : 48}
            />
            {!isCollapsed && (
              <>
                <div>
                  <p className="text-base font-medium text-foreground">
                    У вас пока нет чатов
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Найдите пользователей и начните общение!
                  </p>
                </div>
                <Button
                  className="gap-2 mt-2"
                  size="sm"
                  variant="default"
                  onClick={() => router.push("/search")}
                >
                  <Users size={16} /> Найти
                </Button>
              </>
            )}
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">
            {!isCollapsed && "Не найдено"}
          </div>
        ) : (
          filteredChats.map((chat: Chat) => {
            const isGroup = chat.type === "GROUP" || chat.type === "CHANNEL";
            const chatName = isGroup
              ? chat.name || "Группа"
              : chat.otherParticipant?.name || "Неизвестный";
            const avatar = isGroup
              ? chat.avatarUrl || undefined
              : chat.otherParticipant?.avatarUrl || undefined;

            const isOnline =
              !isGroup && chat.otherParticipant
                ? getStatus(chat.otherParticipant.id)
                : false;

            const isActive = isGroup
              ? params?.groupId === chat.id
              : activeUserId === chat.otherParticipant?.id;

            const unreadCount = chat.unreadCount ?? 0;

            if (isCollapsed) {
              return (
                <button
                  key={chat.id}
                  className={`relative w-full flex items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 ring-1 ring-primary/20"
                      : "hover:bg-muted/60 active:scale-[0.98]"
                  }`}
                  title={chatName}
                  onClick={() => handleChatClick(chat)}
                >
                  <OnlineBadge
                    avatarUrl={avatar}
                    isOnline={isOnline}
                    size="md"
                  />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 shrink-0 bg-blue-500 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold px-1 shadow-sm text-white border-2 border-background">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
              );
            }

            return (
              <button
                key={chat.id}
                className={`group w-full flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 text-left relative ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20"
                    : "hover:bg-muted/60 active:scale-[0.98]"
                }`}
                onClick={() => handleChatClick(chat)}
              >
                <div className="relative shrink-0 pt-0.5">
                  <OnlineBadge
                    avatarUrl={avatar}
                    isOnline={isOnline}
                    size="md"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-start">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-semibold text-[14px] truncate pr-2 tracking-tight ${
                        isActive ? "text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {chatName}
                    </span>
                    <span
                      className={`text-[11px] shrink-0 tabular-nums ${
                        isActive
                          ? "text-primary-foreground/80 font-medium"
                          : "text-muted-foreground font-medium"
                      }`}
                    >
                      {formatChatTime(chat.lastMessageAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[13px] truncate leading-snug ${
                        isActive
                          ? "text-primary-foreground/90"
                          : "text-muted-foreground group-hover:text-foreground/70"
                      }`}
                    >
                      {chat.lastMessage || (
                        <span className="italic opacity-70">Нет сообщений</span>
                      )}
                    </span>
                    {unreadCount > 0 && (
                      <span
                        className={`shrink-0 min-w-[20px] h-5 rounded-full flex items-center justify-center text-[11px] font-bold px-1.5 shadow-sm ${
                          isActive
                            ? "bg-white text-primary"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
