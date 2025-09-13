"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { useGetCategoriesQuery } from "@/src/services/forum.service";

// Порядок секций и их лейблы
const GROUP_ORDER = [
  "social-media",
  "specialised",
  "animated",
  "community",
  "other",
] as const;
const GROUP_LABELS: Record<string, string> = {
  "social-media": "Social Media",
  specialised: "Specialised",
  animated: "Animated",
  community: "Community",
  other: "Other",
};

// Разрешённые категории для Social Media
const SOCIAL_WHITELIST = [
  "instagram",
  "youtube",
  "twitch",
  "tiktok",
  "reddit",
  "twitter",
  "onlyfans",
];

export default function CategoriesListFull() {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();

  // Группируем только корневые категории по group (parentId == null)
  const grouped = useMemo(() => {
    const roots = (categories || []).filter((c: any) => !c.parentId);
    const map: Record<string, any[]> = {};

    for (const cat of roots) {
      const key = (cat.group ?? "other").toLowerCase();
      if (!map[key]) map[key] = [];
      map[key].push(cat);
    }

    // Сортируем внутри секции по имени
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => a.name.localeCompare(b.name, "ru"));
    }

    // Фильтр для Social Media по whitelist (по slug самой категории)
    if (map["social-media"]) {
      map["social-media"] = map["social-media"].filter((c) =>
        SOCIAL_WHITELIST.includes(c.slug)
      );
    }

    return map;
  }, [categories]);

  if (isLoading) return null;
  if (error) return null;

  return (
    <div className="mt-6 space-y-8">
      {GROUP_ORDER.map((groupKey) => {
        const list = grouped[groupKey];
        if (!list || list.length === 0) return null;

        return (
          <section key={groupKey} className="w-full">
            <h2 className="text-lg font-semibold mb-3 flex justify-between items-center">
              {GROUP_LABELS[groupKey] || groupKey}
              {groupKey === "social-media" && (
                <Button as={Link} href="/forum/categories" className="ml-4" size="sm" variant="ghost">
                  Все категории
                </Button>
              )}
            </h2>

            <div className="flex flex-col gap-3">
              {list.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/forum/categories/${cat.slug}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer w-full">
                    <CardBody className="p-3">
                      <div className="flex items-center gap-3">
                        {/* Мини-изображение категории */}
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-default-200">
                          {cat.imageUrl ? (
                            <img
                              src={cat.imageUrl}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-default-500">
                              No image
                            </div>
                          )}
                        </div>

                        {/* Текстовая часть */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base font-semibold truncate">
                              {cat.name}
                            </h3>
                            {cat._count?.threads !== undefined && (
                              <Chip
                                size="sm"
                                variant="flat"
                                className="text-[10px]"
                              >
                                {cat._count.threads} тредов
                              </Chip>
                            )}
                          </div>

                          {cat.description && (
                            <p className="mt-1 text-xs text-default-600 line-clamp-2">
                              {cat.description}
                            </p>
                          )}

                          {/* Дочерние категории (компактно) */}
                          {Array.isArray(cat.children) &&
                            cat.children.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {cat.children
                                  .slice()
                                  .sort((a: any, b: any) =>
                                    a.name.localeCompare(b.name, "ru")
                                  )
                                  .map((ch: any) => (
                                    <Chip
                                      key={ch.id}
                                      size="sm"
                                      variant="bordered"
                                      className="text-[10px]"
                                    >
                                      {ch.name}
                                    </Chip>
                                  ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
