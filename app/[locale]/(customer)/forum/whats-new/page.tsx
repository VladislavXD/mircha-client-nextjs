"use client";

import type { LatestThread } from "@/src/features/forum/types/forum.types";

import Link from "next/link";
import React, { useState } from "react";
import { Card, CardBody, Pagination, Spinner } from "@heroui/react";
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
        <Spinner size="lg" />
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
                <CardBody className="p-3 sm:p-4">
                  <div className="flex gap-3">
                    {/* Превью картинки слева */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden bg-default-200 flex-shrink-0">
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
                      {/* Заголовок треда */}
                      <h3 className="text-base sm:text-lg font-semibold line-clamp-2 break-words">
                        {thread.subject ||
                          `Тред #${thread.shortId || thread.id}`}
                      </h3>

                      {/* Последний: имя — время */}
                      <div className="mt-1 text-xs sm:text-sm text-foreground-600">
                        {t("lastReply")}:{" "}
                        {thread.lastReplyAuthorName || t("anonymous")} — {when}
                      </div>

                      {/* Категория или борд */}
                      <div className="mt-1 text-xs text-foreground-500">
                        {thread.category?.slug
                          ? `/c/${thread.category.slug}`
                          : thread.board?.name
                            ? `/${thread.board.name}/`
                            : ""}
                      </div>

                      {/* Теги под превью */}
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
                </CardBody>
              </Link>
            </Card>
          );
        })}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            showControls
            color="primary"
            page={page}
            size="md"
            total={pagination.totalPages}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
