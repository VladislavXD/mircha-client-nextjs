"use client";

import type { LatestThread } from "@/src/features/forum/types/forum.types";

import Link from "next/link";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { useTranslations } from "next-intl";

import { useLatestThreads } from "@/src/features/forum/hooks/useForum";
import TagChip from "@/shared/components/TagChip";

export default function WhatsNewPage() {
  const t = useTranslations("Forum.whatsNew");
  const [page, setPage] = useState(1);
  const limit = 20;
  const nsfw = "0";

  const { data, isLoading, error } = useLatestThreads(page, limit, nsfw);

  const items = data?.items || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-9 h-9 border-2 border-primary rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger p-8">
        Не удалось загрузить последние посты
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-6xl">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Что нового
        </h1>
        <p className="text-sm text-foreground-500">
          Последние опубликованные треды по всему форуму
        </p>
      </div>

      <div className="space-y-3">
        {items.map((thread: LatestThread) => {
          // Формируем правильный href в зависимости от наличия category
          const href = thread.category?.slug
            ? `/forum/categories/${thread.category.slug}/${thread.slug || thread.id}`
            : thread.board?.name
              ? `/forum/${thread.board.name}/${thread.id}`
              : "#";

          const dateForWhen = thread.lastReplyAt
            ? new Date(thread.lastReplyAt)
            : new Date(thread.createdAt);
          const when = formatDistanceToNow(dateForWhen, {
            addSuffix: true,
            locale: ru,
          });

          return (
            <Card key={thread.id} className="hover:shadow-md transition-shadow">
              <Link className="block" href={href}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex gap-3">
                    {/* Preview image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {thread.thumbnailUrl || thread.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          alt="preview"
                          className="w-full h-full object-cover"
                          src={thread.thumbnailUrl || thread.imageUrl!}
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          alt="preview"
                          className="w-full h-full object-cover"
                          src="/images/mirchanLogo.jpg"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold line-clamp-2 break-words">
                        {thread.subject || `Тред #${thread.shortId || thread.id}`}
                      </h3>

                      <div className="mt-1 text-xs sm:text-sm text-muted-foreground">
                        {t("lastReply")}:{" "}
                        <span className="font-medium">
                          {thread.lastReplyAuthorName || t("anonymous")}
                        </span>
                        {" — "}
                        <span>{when}</span>
                      </div>

                      <div className="mt-1 text-xs text-muted-foreground">
                        {thread.category?.slug
                          ? `/c/${thread.category.slug}`
                          : thread.board?.name
                          ? `/${thread.board.name}/`
                          : ""}
                      </div>

                      {Array.isArray(thread.tags) && thread.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {thread.tags.map((tag) => (
                            <TagChip
                              key={tag.slug}
                              tag={{
                                id: tag.id,
                                name: tag.name,
                                slug: tag.slug,
                                icon: tag.icon,
                                color: tag.color,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Назад
          </Button>

          <div className="text-sm text-muted-foreground">
            Страница {page} из {pagination.totalPages}
          </div>

          <Button
            variant="outline"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
          >
            Вперёд
          </Button>
        </div>
      )}
    </div>
  );
}
