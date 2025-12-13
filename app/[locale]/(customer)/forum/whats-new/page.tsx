"use client"

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
// TODO: Migrate to React Query: Create useLatestPosts hook
// @ts-ignore
import { useGetLatestPostsQuery, LatestThreadItem } from '@/src/services/forum.service.old'
import { Card, CardBody, CardHeader, Chip, Pagination, Spinner } from '@heroui/react'
import TagChip from '@/shared/components/TagChip'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

export default function WhatsNewPage(){
  const [page, setPage] = useState(1)
  const limit = 20
  const { data, isLoading, error } = useGetLatestPostsQuery({ page, limit, nsfw: '0' })

  const items = data?.items || []
  const pagination = data?.pagination

  if (isLoading){
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error){
    return (
      <div className="text-center text-danger p-8">Не удалось загрузить последние посты</div>
    )
  }



  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-6xl">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Что нового</h1>
        <p className="text-sm text-foreground-500">Последние опубликованные треды по всему форуму</p>
      </div>

      <div className="space-y-3">
  {items.map((t: LatestThreadItem) => {
          const href = t.board?.name ? `/forum/${t.board.name}/${t.id}` : '#'
          const dateForWhen = t.lastReplyAt ? new Date(t.lastReplyAt) : new Date(t.createdAt)
          const when = formatDistanceToNow(dateForWhen, { addSuffix: true, locale: ru })
          return (
            <Card key={t.id} className="hover:shadow-md transition-shadow">
              <Link href={href} className="block">
                <CardBody className="p-3 sm:p-4">
                  <div className="flex gap-3">
                    {/* Превью картинки слева */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden bg-default-200 flex-shrink-0">
                      {t.thumbnailUrl || t.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.thumbnailUrl || t.imageUrl!} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src="/images/mirchanLogo.jpg" alt="preview" className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Заголовок треда */}
                      <h3 className="text-base sm:text-lg font-semibold line-clamp-2 break-words">
                        {t.subject || `Тред #${t.shortId || t.id}`}
                      </h3>
                      {/* Последний: имя — время */}
                      <div className="mt-1 text-xs sm:text-sm text-foreground-600">
                        Последний: {t.lastReplyAuthorName || 'Аноним'} — {when}
                      </div>
                      {/* Категория или борд */}
                      <div className="mt-1 text-xs text-foreground-500">
                        {t.category?.slug ? t.category.slug : (t.board?.name ? `/${t.board.name}/` : '')}
                      </div>

                      {/* Теги под превью */}
                      {Array.isArray(t.tags) && t.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {/* @ts-ignore */}
                          {t.tags.map((tag) => (
                            <TagChip key={tag.slug} tag={{ id: tag.id, name: tag.name, slug: tag.slug, icon: tag.icon, color: tag.color }} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Link>
            </Card>
          )
        })}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-end">
          <Pagination
            showControls
            total={pagination.totalPages}
            page={page}
            onChange={setPage}
            size="md"
            color="primary"
          />
        </div>
      )}
    </div>
  )
}
