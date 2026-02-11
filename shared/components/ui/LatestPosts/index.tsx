"use client"

import React from 'react'
import Link from 'next/link'
import { Spinner } from '@heroui/react'
import { useLatestThreads } from '@/src/features/forum/hooks/useForum'
import type { LatestThread } from '@/src/features/forum/types/forum.types'
import TagChip from '@/shared/components/TagChip'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useTranslations } from 'next-intl'

type Props = {
	limit?: number
}

const LatestPosts = ({ limit = 8 }: Props) => {
	const { data, isLoading, error } = useLatestThreads(1, limit, '0')
	const items = data?.items || []

	const t = useTranslations("HomePage.rightSidebar")
	
	return (
		<div className="rounded-medium border border-default-200 dark:border-default-100/20 p-3">
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-sm font-semibold">{t("whatsNew")}</h3>
				<Link href="/forum/whats-new" className="text-xs text-primary hover:underline">{t("showAll")}</Link>
			</div>

			{isLoading && (
				<div className="flex justify-center py-6">
					<Spinner size="sm" />
				</div>
			)}

			{error && (
				<div className="text-xs text-danger py-3">Не удалось загрузить</div>
			)}

			{!isLoading && !error && items.length === 0 && (
				<div className="text-xs text-foreground-500 py-3">Пока пусто</div>
			)}

			<ul className="space-y-3">
				{items.map((thread: LatestThread) => {
					const href = thread.category?.slug
						? `/forum/categories/${thread.category.slug}/${thread.slug || thread.id}`
						: thread.board?.name
							? `/forum/${thread.board.name}/${thread.id}`
							: '#'
					const dateForWhen = thread.lastReplyAt ? new Date(thread.lastReplyAt) : new Date(thread.createdAt)
					const when = formatDistanceToNow(dateForWhen, { addSuffix: true, locale: ru })
					const source = thread.category?.slug ? thread.category.slug : (thread.board?.name ? `/${thread.board.name}/` : '')
					const preview = thread.thumbnailUrl || thread.imageUrl || '/images/mirchanLogo.jpg'
					return (
						<li key={thread.id} className="flex gap-2">
							<Link href={href} className="block w-14 h-14 flex-shrink-0 overflow-hidden rounded-small bg-default-200">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={preview} alt="preview" className="w-full h-full object-cover" loading="lazy" />
							</Link>
							<div className="min-w-0 flex-1">
								<Link href={href} className="block text-sm font-medium line-clamp-1 break-words hover:underline">
									{thread.subject || `Тред #${thread.shortId || thread.id}`}
								</Link>
								<div className="text-[11px] text-foreground-500 mt-0.5">
									Последний: {thread.lastReplyAuthorName || 'Аноним'} — {when}
								</div>
								<div className="text-[11px] text-foreground-400">{source}</div>
								{Array.isArray(thread.tags) && thread.tags.length > 0 && (
									<div className="mt-1 flex flex-wrap gap-1">
										{thread.tags.slice(0, 4).map((tag) => (
											<TagChip key={tag.slug} tag={{ id: tag.id, name: tag.name, slug: tag.slug, icon: tag.icon, color: tag.color }} />
										))}
									</div>
								)}
							</div>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default LatestPosts