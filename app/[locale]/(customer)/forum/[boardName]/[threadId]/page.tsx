"use client";

import type { Thread, Reply } from "@/src/features/forum";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import CreateReplyModal from "./components/CreateReplyModal";
import PostContent from "@/shared/components/PostContent";
import MobileForumExtras from "@/shared/components/forum/MobileForumExtras";
import { useThread } from "@/src/features/forum";

const ThreadPage = () => {
  const params = useParams();
  const boardName = params.boardName as string;
  const threadId = params.threadId as string;

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyToPost, setReplyToPost] = useState<{
    post: Thread | Reply;
    id: string;
  } | null>(null);

  const { data: thread, isLoading, error } = useThread(boardName, threadId);

  const allPosts = useMemo(() => {
    if (!thread) return [];
    return [thread, ...(thread.replies || [])];
  }, [thread]);

  const handleReplyToPost = (postId: string, post?: Thread | Reply) => {
    if (post) {
      setReplyToPost({ post, id: postId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-8">
        <h2 className="text-xl font-bold mb-2">Ошибка загрузки</h2>
        <p>Не удалось загрузить тред</p>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-2">Тред не найден</h2>
        <p className="text-muted-foreground mb-4">
          Тред не существует или был удалён
        </p>
        <Button asChild>
          <Link href={`/forum/${boardName}`}>Вернуться к борду</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-6xl">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/forum">Форум</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/forum/${boardName}`}>/{boardName}/</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <span className="hidden sm:inline">Тред #{threadId}</span>
              <span className="sm:hidden">#{threadId}</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2 flex-wrap">
            <span className="break-words min-w-0">
              {thread.subject || `Тред #${thread.id}`}
            </span>
            {thread.isPinned && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-400">
                Закреплён
              </Badge>
            )}
            {thread.isLocked && (
              <Badge variant="secondary">Заблокирован</Badge>
            )}
          </h1>
          <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1 flex-wrap">
            <span>{thread._count?.replies || 0} ответов</span>
            <span>{thread.imageCount} изображений</span>
            <span>{thread.uniquePosters} постеров</span>
          </div>
        </div>

        {!thread.isLocked && (
          <Button
            className="self-start sm:self-auto"
            size="sm"
            variant="outline"
            onClick={() => setShowReplyModal(true)}
          >
            Ответить
          </Button>
        )}
      </div>

      <div className="mb-4">
        <PostContent
          allPosts={allPosts as any}
          isOP={true}
          post={thread as any}
          onReplyToPost={handleReplyToPost as any}
        />
      </div>

      <div className="space-y-3 sm:space-y-4">
        {thread.replies?.map((reply: Reply) => (
          <PostContent
            key={reply.id}
            allPosts={allPosts as any}
            isOP={false}
            post={reply as any}
            onReplyToPost={handleReplyToPost as any}
          />
        ))}
      </div>

      {thread.replies?.length === 0 && (
        <div className="text-center py-6 sm:py-8">
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            Пока нет ответов в этом треде
          </p>
          {!thread.isLocked && (
            <Button size="sm" onClick={() => setShowReplyModal(true)}>
              Написать первый ответ
            </Button>
          )}
        </div>
      )}

      {!thread.isLocked && (
        <div className="fixed bottom-4 right-2 sm:right-4 z-50">
          <Button
            className="rounded-full shadow-lg"
            onClick={() => setShowReplyModal(true)}
          >
            <span className="hidden sm:inline">Ответить</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      )}

      <CreateReplyModal
        boardName={boardName}
        isOpen={showReplyModal}
        thread={thread}
        threadId={threadId}
        onClose={() => setShowReplyModal(false)}
      />

      <MobileForumExtras />
    </div>
  );
};

export default ThreadPage;