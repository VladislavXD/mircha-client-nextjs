"use client"

import React from 'react'
// import { useForumStats } from '@/src/hooks/forum'
import { Spinner } from '@heroui/react'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useTranslations } from 'next-intl'

const StatItem = ({ label, value }: { label: string; value: number | string }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-foreground-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
)

export default function ForumStats() {
  const forum = [{data: {
    boards: 42,
    threads: 128,
    replies: 1024,
    media: 512,
    images: 256,
    videos: 128,
    categories: 8,
    tags: 64,
    lastActivity: new Date().toISOString(),
  }, isLoading: false, error: null}]
  const { data, isLoading, error } = forum[0]; // useForumStats()


  const t = useTranslations("HomePage.rightSidebar")
  return (
    <div className="rounded-medium border border-default-200 dark:border-default-100/20 p-3">
      <h3 className="text-sm font-semibold mb-2">{t("statisticforum")}</h3>
      {isLoading && (
        <div className="flex justify-center py-4"><Spinner size="sm" /></div>
      )}
      {error && (
        <div className="text-xs text-danger py-2">Ошибка загрузки</div>
      )}
      {data && (
        <div className="space-y-1.5">
          <StatItem label={t("boards")} value={data.boards} />
          <StatItem label={t("threads")} value={data.threads} />
          <StatItem label={t("posts")} value={data.replies} />
          <StatItem label={t("media")} value={data.media} />
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-small bg-default-100/50 py-1.5 px-2 text-center">
              <div className="text-[11px] text-foreground-500">{t("images")}</div>
              <div className="text-sm font-medium">{data.images}</div>
            </div>
            <div className="rounded-small bg-default-100/50 py-1.5 px-2 text-center">
              <div className="text-[11px] text-foreground-500">{t("videos")}</div>
              <div className="text-sm font-medium">{data.videos}</div>
            </div>
          </div>
          <StatItem label={t("categories")} value={data.categories} />
          <StatItem label={t("tags")} value={data.tags} />
          <div className="text-[11px] text-foreground-500 mt-2">
            {t("lastActive")}: {data.lastActivity ? formatDistanceToNow(new Date(data.lastActivity), { addSuffix: true, locale: ru }) : '—'}
          </div>
        </div>
      )}
    </div>
  )
}
