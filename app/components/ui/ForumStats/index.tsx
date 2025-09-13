"use client"

import React from 'react'
import { useGetForumStatsQuery } from '@/src/services/forum.service'
import { Spinner } from '@heroui/react'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

const StatItem = ({ label, value }: { label: string; value: number | string }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-foreground-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
)

export default function ForumStats() {
  const { data, isLoading, error } = useGetForumStatsQuery()

  return (
    <div className="rounded-medium border border-default-200 dark:border-default-100/20 p-3">
      <h3 className="text-sm font-semibold mb-2">Статистика форума</h3>
      {isLoading && (
        <div className="flex justify-center py-4"><Spinner size="sm" /></div>
      )}
      {error && (
        <div className="text-xs text-danger py-2">Ошибка загрузки</div>
      )}
      {data && (
        <div className="space-y-1.5">
          <StatItem label="Борды" value={data.boards} />
          <StatItem label="Треды" value={data.threads} />
          <StatItem label="Ответы" value={data.replies} />
          <StatItem label="Медиа" value={data.media} />
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-small bg-default-100/50 py-1.5 px-2 text-center">
              <div className="text-[11px] text-foreground-500">Изображения</div>
              <div className="text-sm font-medium">{data.images}</div>
            </div>
            <div className="rounded-small bg-default-100/50 py-1.5 px-2 text-center">
              <div className="text-[11px] text-foreground-500">Видео</div>
              <div className="text-sm font-medium">{data.videos}</div>
            </div>
          </div>
          <StatItem label="Категории" value={data.categories} />
          <StatItem label="Теги" value={data.tags} />
          <div className="text-[11px] text-foreground-500 mt-2">
            Последняя активность: {data.lastActivity ? formatDistanceToNow(new Date(data.lastActivity), { addSuffix: true, locale: ru }) : '—'}
          </div>
        </div>
      )}
    </div>
  )
}
