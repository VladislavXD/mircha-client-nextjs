'use client'

import React, { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { 
  useGetThreadQuery 
} from '@/src/services/forum.service'
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Chip, 
  Spinner, 
  Button,
  Breadcrumbs,
  BreadcrumbItem,
  Avatar,
  Divider
} from '@heroui/react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import CreateReplyModal from './components/CreateReplyModal'
import ReplyToPostModal from '@/app/components/ReplyToPostModal'
import PostContent from '@/app/components/PostContent'
import type { Thread, Reply } from '@/src/types/types'

const ThreadPage = () => {
  const params = useParams()
  const boardName = params.boardName as string
  const threadId = params.threadId as string
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [showReplyToPostModal, setShowReplyToPostModal] = useState(false)
  const [replyToPost, setReplyToPost] = useState<{post: Thread | Reply, id: string} | null>(null)

  const { 
    data: thread, 
    isLoading, 
    error 
  } = useGetThreadQuery({ boardName, threadId })

  // Создаем массив всех постов для передачи в PostContent для тултипов
  const allPosts = useMemo(() => {
    if (!thread) return []
    return [thread, ...(thread.replies || [])]
  }, [thread])

  // Обработчик ответа на конкретный пост
  const handleReplyToPost = (postId: string, post?: Thread | Reply) => {
    if (post) {
      setReplyToPost({ post, id: postId })
      setShowReplyToPostModal(true)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        <h2 className="text-xl font-bold mb-2">Ошибка загрузки</h2>
        <p>Не удалось загрузить тред</p>
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-2">Тред не найден</h2>
        <p>Тред не существует или был удалён</p>
        <Link href={`/forum/${boardName}`}>
          <Button color="primary" className="mt-4">
            Вернуться к борду
          </Button>
        </Link>
      </div>
    )
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
              <Chip color="warning" size="sm" variant="flat" className="text-xs">
                Закреплён
              </Chip>
            )}
            {thread.isLocked && (
              <Chip color="secondary" size="sm" variant="flat" className="text-xs">
                Заблокирован
              </Chip>
            )}
          </h1>
          <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 flex-wrap">
            <span>{thread._count?.replies || 0} ответов</span>
            <span>{thread.imageCount} изображений</span>
            <span className="hidden sm:inline">{thread.uniquePosters} уникальных постеров</span>
            <span className="sm:hidden">{thread.uniquePosters} постеров</span>
          </div>
        </div>
        
        {!thread.isLocked && (
          <Button 
            color="primary" 
            variant="flat"
            size="sm"
            onPress={() => setShowReplyModal(true)}
            className="self-start sm:self-auto"
          >
            Ответить
          </Button>
        )}
      </div>

      {/* Основной пост треда */}
      <div className="mb-4">
        <PostContent 
          post={thread}
          isOP={true}
          allPosts={allPosts}
          onReplyToPost={handleReplyToPost}
        />
      </div>

      {/* Ответы */}
      <div className="space-y-3 sm:space-y-4">
        {thread.replies?.map((reply) => (
          <PostContent 
            key={reply.id}
            post={reply}
            isOP={false}
            allPosts={allPosts}
            onReplyToPost={handleReplyToPost}
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
            color="primary"
            size="md"
            onPress={() => setShowReplyModal(true)}
            className="rounded-full shadow-lg text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Ответить</span>
            <span className="sm:hidden">+</span>
          </Button>
        </div>
      )}

      <CreateReplyModal 
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        boardName={boardName}
        threadId={threadId}
        thread={thread}
      />

      <ReplyToPostModal 
        isOpen={showReplyToPostModal}
        onClose={() => {
          setShowReplyToPostModal(false)
          setReplyToPost(null)
        }}
        boardName={boardName}
        threadId={threadId}
        thread={thread}
        replyToPost={replyToPost?.post}
        replyToPostId={replyToPost?.id}
      />
    </div>
  )
}

export default ThreadPage
