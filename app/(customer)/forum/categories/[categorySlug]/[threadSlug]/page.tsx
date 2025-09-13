'use client'

import React, { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { 
  useGetCategoryQuery,
  useGetThreadByCategoryAndSlugQuery
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
import PostContent from '@/app/components/PostContent'
import type { Thread, Reply } from '@/src/types/types'
import TagChip from '@/app/components/TagChip'
import MobileForumExtras from '@/app/components/forum/MobileForumExtras'

const CategoryThreadPage = () => {
  const params = useParams()
  const categorySlug = params.categorySlug as string
  const threadSlug = params.threadSlug as string
  
  const [showReplyModal, setShowReplyModal] = useState(false)

  const { data: category } = useGetCategoryQuery(categorySlug)

  const { 
    data: thread, 
    isLoading, 
    error 
  } = useGetThreadByCategoryAndSlugQuery({ categorySlug, threadSlug })

  // Создаем массив всех постов для передачи в PostContent для тултипов
  const allPosts = useMemo(() => {
    if (!thread) return []
    return [thread, ...(thread.replies || [])]
  }, [thread])

  // Обработчик ответа на конкретный пост (пока просто открываем обычный ответ)
  const handleReplyToPost = (postId: string, post?: Thread | Reply) => {
    setShowReplyModal(true)
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
        <Link href={`/forum/categories/${categorySlug}`}>
          <Button color="primary" className="mt-4">
            Вернуться к категории
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
          <Link href="/forum/categories">Категории</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href={`/forum/categories/${categorySlug}`}>{category?.name || categorySlug}</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <span className="hidden sm:inline">{thread.subject || `Тред #${thread.id}`}</span>
          <span className="sm:hidden">#{thread.id}</span>
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

          {/* Теги треда */}
          {thread.threadTags && thread.threadTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {thread.threadTags.map(({ tag }) => (
                <TagChip key={tag.id} tag={{ id: tag.id, name: tag.name, slug: tag.slug, icon: tag.icon, color: tag.color }} />
              ))}
            </div>
          )}

          <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 flex-wrap">
            <span>{thread._count?.replies || 0} ответов</span>
            <span>{thread.imageCount} изображений</span>
            <span>{thread.uniquePosters} постеров</span>
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
        categorySlug={categorySlug}
        threadId={thread.id}
        thread={thread}
      />

      {/* Мобильные виджеты: внизу страницы */}
      <MobileForumExtras />
    </div>
  )
}

export default CategoryThreadPage