"use client";

import type { Thread, Reply } from "@/src/features/forum";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Chip,
  Spinner,
  Button,
  Breadcrumbs,
  BreadcrumbItem,
} from "@heroui/react";
import Link from "next/link";

import CreateReplyModal from "./components/CreateReplyModal";

import { useThread } from "@/src/features/forum";
// import ReplyToPostModal from '@/shared/components/ReplyToPostModal'
import PostContent from "@/shared/components/PostContent";
import MobileForumExtras from "@/shared/components/forum/MobileForumExtras";

const ThreadPage = () => {
  const params = useParams();
  const boardName = params.boardName as string;
  const threadId = params.threadId as string;
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showReplyToPostModal, setShowReplyToPostModal] = useState(false);
  const [replyToPost, setReplyToPost] = useState<{
    post: Thread | Reply;
    id: string;
  } | null>(null);

  const { data: thread, isLoading, error } = useThread(boardName, threadId);

  // Создаем массив всех постов для передачи в PostContent для тултипов
  const allPosts = useMemo(() => {
    if (!thread) return [];

    return [thread, ...(thread.replies || [])];
  }, [thread]);

  // Обработчик ответа на конкретный пост
  const handleReplyToPost = (postId: string, post?: Thread | Reply) => {
    if (post) {
      setReplyToPost({ post, id: postId });
      setShowReplyToPostModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <h2 className="text-xl font-bold mb-2">Ошибка загрузки</h2>
        <p>Не удалось загрузить тред</p>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-2">Тред не найден</h2>
        <p>Тред не существует или был удалён</p>
        <Link href={`/forum/${boardName}`}>
          <Button className="mt-4" color="primary">
            Вернуться к борду
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-6xl">
      {/* Хлебные крошки */}
      <Breadcrumbs className="mb-4 text-sm">
        <BreadcrumbItem>
          <Link href="/forum">Форум</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href={`/forum/${boardName}`}>/{boardName}/</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <span className="hidden sm:inline">Тред #{threadId}</span>
          <span className="sm:hidden">#{threadId}</span>
        </BreadcrumbItem>
      </Breadcrumbs>

      {/* Информация о треде */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2 flex-wrap">
            <span className="break-words min-w-0">
              {thread.subject || `Тред #${thread.id}`}
            </span>
            {thread.isPinned && (
              <Chip
                className="text-xs"
                color="warning"
                size="sm"
                variant="flat"
              >
                Закреплён
              </Chip>
            )}
            {thread.isLocked && (
              <Chip
                className="text-xs"
                color="secondary"
                size="sm"
                variant="flat"
              >
                Заблокирован
              </Chip>
            )}
          </h1>
          <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 flex-wrap">
            <span>{thread._count?.replies || 0} ответов</span>
            <span>{thread.imageCount} изображений</span>
            <span>{thread.uniquePosters} постеров</span>
          </div>
        </div>

        {!thread.isLocked && (
          <Button
            className="self-start sm:self-auto"
            color="primary"
            size="sm"
            variant="flat"
            onPress={() => setShowReplyModal(true)}
          >
            Ответить
          </Button>
        )}
      </div>

      {/* Основной пост треда */}
      <div className="mb-4">
        <PostContent
          allPosts={allPosts as any}
          isOP={true}
          post={thread as any}
          onReplyToPost={handleReplyToPost as any}
        />
      </div>

      {/* Ответы */}
      <div className="space-y-3 sm:space-y-4">
        {thread.replies?.map((reply) => (
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
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">
            Пока нет ответов в этом треде
          </p>
          {!thread.isLocked && (
            <Button
              color="primary"
              size="sm"
              onPress={() => setShowReplyModal(true)}
            >
              Написать первый ответ
            </Button>
          )}
        </div>
      )}

      {/* Быстрый ответ */}
      {!thread.isLocked && (
        <div className="fixed bottom-4 right-2 sm:right-4 z-50">
          <Button
            className="rounded-full shadow-lg text-sm sm:text-base"
            color="primary"
            size="md"
            onPress={() => setShowReplyModal(true)}
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

      {/* <ReplyToPostModal 
        isOpen={showReplyToPostModal}
        onClose={() => {
          setShowReplyToPostModal(false)
          setReplyToPost(null)
        }}
        boardName={boardName}
        threadId={threadId}
        thread={thread as any}
        replyToPost={replyToPost?.post as any}
        replyToPostId={replyToPost?.id}
      /> */}

      {/* Мобильные виджеты: внизу страницы */}
      <MobileForumExtras />
    </div>
  );
};

export default ThreadPage;
