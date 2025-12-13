'use client'

import React, { useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
// TODO: Migrate to React Query: Create useCategory, useCategoryThreads, useTags hooks
import { 
  useGetCategoryQuery, 
  useGetCategoryThreadsQuery,
  useGetTagsQuery
} from '@/src/services/forum.service.old'
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Chip, 
  Spinner, 
  Button,
  Breadcrumbs,
  BreadcrumbItem,
  Select,
  SelectItem
} from '@heroui/react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import CreateThreadModal from './components/CreateThreadModal'
import MediaThumbnail from '@/shared/components/MediaThumbnail'
import TagChip from '@/shared/components/TagChip'
import MobileForumExtras from '@/shared/components/forum/MobileForumExtras'

const CategoryPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const categorySlug = params.categorySlug as string
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  // Получаем параметры фильтрации
  const currentTag = searchParams.get('tag') || ''
  const currentPage = parseInt(searchParams.get('page') || '1')

  const { 
    data: category, 
    isLoading: categoryLoading, 
    error: categoryError 
  } = useGetCategoryQuery(categorySlug)

  const { 
    data: threadResponse, 
    isLoading: threadsLoading, 
    error: threadsError 
  } = useGetCategoryThreadsQuery({
    slug: categorySlug,
    tag: currentTag || undefined,
    page: currentPage,
    limit: 10
  })

  const { data: tags } = useGetTagsQuery()

  if (categoryLoading || threadsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (categoryError || threadsError) {
    return (
      <div className="text-center text-red-500 p-8">
        <h2 className="text-xl font-bold mb-2">Ошибка загрузки</h2>
        <p>Не удалось загрузить категорию или треды</p>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold mb-2">Категория не найдена</h2>
        <p>Категория {categorySlug} не существует</p>
        <Link href="/forum/categories">
          <Button color="primary" className="mt-4">
            Вернуться к категориям
          </Button>
        </Link>
      </div>
    )
  }

  const threads = threadResponse?.threads || []
  const pagination = threadResponse?.pagination

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
          {category.name}
        </BreadcrumbItem>
      </Breadcrumbs>

      {/* Заголовок категории */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2 flex-wrap">
              <span className="break-words">{category.name}</span>
              {category.color && (
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: category.color }}
                />
              )}
            </h1>
            {category.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                {category.description}
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

        {/* Дочерние категории */}
        {category.children && category.children.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Подкатегории:</h3>
            <div className="flex flex-wrap gap-2">
              {category.children.map((child) => (
                <Link key={child.id} href={`/forum/categories/${child.slug}`}>
                  <Chip 
                    size="sm" 
                    variant="bordered" 
                    className="cursor-pointer hover:bg-primary-50"
                  >
                    {child.name} ({child._count?.threads || 0})
                  </Chip>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Фильтр по тегам */}
        {tags && tags.length > 0 && (
          <div className="mb-4">
            <Select
              label="Фильтр по тегу"
              placeholder="Все треды"
              selectedKeys={currentTag ? new Set([currentTag]) : new Set([])}
              onSelectionChange={(keys) => {
                const selectedTag = Array.from(keys as Set<string>)[0] || ''
                const url = new URL(window.location.href)
                if (selectedTag) {
                  url.searchParams.set('tag', selectedTag)
                } else {
                  url.searchParams.delete('tag')
                }
                url.searchParams.delete('page')
                window.history.pushState({}, '', url.toString())
                window.location.reload()
              }}
              className="max-w-xs"
              size="sm"
              isClearable
              items={tags}
            >
              {(tag) => (
                <SelectItem
                  key={tag.slug}
                  textValue={tag.name}
                  startContent={
                    tag.icon ? (
                      /^https?:\/\//.test(tag.icon) ? (
                        <img src={tag.icon} alt="" className="w-4 h-4 object-cover rounded" />
                      ) : (
                        <span className="text-sm">{tag.icon}</span>
                      )
                    ) : null
                  }
                >
                  {`${tag.name} (${tag._count?.threadTags || 0})`}
                </SelectItem>
              )}
            </Select>
          </div>
        )}

        {/* Статистика категории */}
        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <span>Тредов: {category._count?.threads || 0}</span>
          {currentTag && (
            <span>С тегом "{tags?.find(t => t.slug === currentTag)?.name}": {pagination?.total || 0}</span>
          )}
        </div>
      </div>

      {/* Список тредов */}
      <div className="space-y-3 sm:space-y-4">
        {threads?.map((thread) => (
          <Link key={thread.id} href={`/forum/categories/${categorySlug}/${thread.slug || thread.id}`}>
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

                    {/* Теги треда */}
                    {thread.threadTags && thread.threadTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {thread.threadTags.map(({ tag }) => (
                          <TagChip key={tag.id} tag={{ id: tag.id, name: tag.name, slug: tag.slug, icon: tag.icon, color: tag.color }} />
                        ))}
                      </div>
                    )}
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
                  {/* Отображение медиафайлов */}
                  {thread.mediaFiles && thread.mediaFiles.length > 0 && (
                    <div className="flex-shrink-0 self-start">
                      {thread.mediaFiles.length === 1 ? (
                        <MediaThumbnail
                          url={thread.mediaFiles[0].url}
                          thumbnailUrl={thread.mediaFiles[0].thumbnailUrl}
                          name={thread.mediaFiles[0].name}
                          size={thread.mediaFiles[0].size}
                          variant="medium"
                          showInfo={false}
                          className="border border-gray-200 dark:border-gray-700 w-full sm:w-auto max-w-full"
                        />
                      ) : (
                        <div className="relative">
                          <MediaThumbnail
                            url={thread.mediaFiles[0].url}
                            thumbnailUrl={thread.mediaFiles[0].thumbnailUrl}
                            name={thread.mediaFiles[0].name}
                            size={thread.mediaFiles[0].size}
                            variant="medium"
                            showInfo={false}
                            className="border border-gray-200 dark:border-gray-700 w-full sm:w-auto max-w-full"
                          />
                          <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                            +{thread.mediaFiles.length - 1}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-3 sm:line-clamp-4 break-words">
                      {thread.content}
                    </p>
                  </div>
                </div>

                {/* Последний ответ */}
                {thread.lastBumpAt && (
                  <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Последняя активность</span>
                      <span>
                        {formatDistanceToNow(new Date(thread.lastBumpAt), { 
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

      {/* Пагинация */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link href={`/forum/categories/${categorySlug}?page=${currentPage - 1}${currentTag ? `&tag=${currentTag}` : ''}`}>
                <Button size="sm" variant="flat">
                  Назад
                </Button>
              </Link>
            )}
            
            <span className="flex items-center px-3 text-sm">
              Страница {currentPage} из {pagination.totalPages}
            </span>

            {currentPage < pagination.totalPages && (
              <Link href={`/forum/categories/${categorySlug}?page=${currentPage + 1}${currentTag ? `&tag=${currentTag}` : ''}`}>
                <Button size="sm" variant="flat">
                  Вперёд
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {threads?.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Нет тредов</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {currentTag 
              ? `Нет тредов с тегом "${tags?.find(t => t.slug === currentTag)?.name}"`
              : 'Будьте первым, кто создаст тред в этой категории'
            }
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
        categorySlug={categorySlug}
        category={category}
      />

      {/* Мобильные виджеты: внизу страницы */}
      <MobileForumExtras />
    </div>
  )
}

export default CategoryPage