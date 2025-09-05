'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { 
  useGetBoardByNameQuery, 
  useGetThreadsQuery 
} from '@/src/services/forum.service'
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Chip, 
  Spinner, 
  Button,
  Breadcrumbs,
  BreadcrumbItem
} from '@heroui/react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import CreateThreadModal from './components/CreateThreadModal'
import MediaThumbnail from '@/app/components/MediaThumbnail'

const BoardPage = () => {
  const params = useParams()
  const boardName = params.boardName as string
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { 
    data: board, 
    isLoading: boardLoading, 
    error: boardError 
  } = useGetBoardByNameQuery(boardName)

  const { 
    data: threads, 
    isLoading: threadsLoading, 
    error: threadsError 
  } = useGetThreadsQuery(boardName)

  if (boardLoading || threadsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (boardError || threadsError) {
    return (
      <div className="text-center text-red-500 p-8">
        <h2 className="text-xl font-bold mb-2">Ошибка загрузки</h2>
        <p>Не удалось загрузить борд или треды</p>
      </div>
    )
  }

  if (!board) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-2">Борд не найден</h2>
        <p>Борд /{boardName}/ не существует</p>
        <Link href="/forum">
          <Button color="primary" className="mt-4">
            Вернуться к форуму
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
          /{board.name}/
        </BreadcrumbItem>
      </Breadcrumbs>

      {/* Заголовок борда */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 flex-wrap">
              <span className="break-words">/{board.name}/ - {board.title}</span>
              {board.isNsfw && (
                <Chip color="danger" size="sm" variant="flat" className="text-xs">
                  NSFW
                </Chip>
              )}
            </h1>
            {board.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                {board.description}
              </p>
            )}
          </div>
          <Button 
            color="primary" 
            variant="flat"
            size="sm"
            onPress={() => setShowCreateModal(true)}
            className="self-start sm:self-auto"
          >
            <span className="hidden sm:inline">Создать тред</span>
            <span className="sm:hidden">Создать</span>
          </Button>
        </div>

        {/* Статистика борда */}
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <span>Тредов: {board._count?.threads || 0}</span>
          <span>Постов: {board._count?.replies || 0}</span>
          <span>Файлы: {Math.round((board.maxFileSize || 0) / 1024 / 1024)}MB</span>
        </div>
      </div>

      {/* Список тредов */}
      <div className="space-y-3 sm:space-y-4">
        {threads?.map((thread) => (
          <Link key={thread.id} href={`/forum/${boardName}/${thread.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-2 px-3 sm:px-6">
                <div className="flex justify-between items-start w-full">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold line-clamp-2 break-words">
                      {thread.subject || `Тред #${thread.id}`}
                    </h3>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                      <span>Анон</span>
                      <span>•</span>
                      <span>
                        {formatDistanceToNow(new Date(thread.createdAt), { 
                          addSuffix: true, 
                          locale: ru 
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
                    <Chip color="default" size="sm" variant="flat" className="text-xs">
                      {thread._count?.replies || 0} ответов
                    </Chip>
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
                  </div>
                </div>
              </CardHeader>
              
              <CardBody className="pt-0 px-3 sm:px-6">
                {/* Превью контента треда */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  {thread.imageUrl && (
                    <div className="flex-shrink-0 self-start">
                      <MediaThumbnail
                        url={thread.imageUrl}
                        thumbnailUrl={thread.thumbnailUrl}
                        name={thread.imageName}
                        size={thread.imageSize}
                        variant="medium"
                        showInfo={false}
                        className="border border-gray-200 dark:border-gray-700 w-full sm:w-auto max-w-full"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-3 sm:line-clamp-4 break-words">
                      {thread.content}
                    </p>
                  </div>
                </div>

                {/* Последний ответ */}
                {thread.lastReply && (
                  <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Последний ответ: Анон</span>
                      <span>
                        {formatDistanceToNow(new Date(thread.lastReply), { 
                          addSuffix: true, 
                          locale: ru 
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {threads?.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Нет тредов</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Будьте первым, кто создаст тред в этом борде
          </p>
          <Button 
            color="primary"
            onPress={() => setShowCreateModal(true)}
          >
            Создать первый тред
          </Button>
        </div>
      )}

      <CreateThreadModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        boardName={boardName}
        board={board}
      />
    </div>
  )
}

export default BoardPage
