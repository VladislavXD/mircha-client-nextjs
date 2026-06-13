"use client";

import React, { useMemo } from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useCategories } from "@/src/features/forum";

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
  const { data: categories, isLoading, error } = useCategories();

  const grouped = useMemo(() => {
    const roots = (categories || []).filter((c: any) => !c.parentId);
    const map: Record<string, any[]> = {};

    for (const cat of roots) {
      const key = (cat.group ?? "other").toLowerCase();
      if (!map[key]) map[key] = [];
      map[key].push(cat);
    }

    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => a.name.localeCompare(b.name, "ru"));
    }

    if (map["social-media"]) {
      map["social-media"] = map["social-media"].filter((c) =>
        SOCIAL_WHITELIST.includes(c.slug),
      );
    }

    return map;
  }, [categories]);

  if (isLoading || error) return null;

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
                <Button asChild className="ml-4" size="sm" variant="ghost">
                  <Link href="/forum/categories">Все категории</Link>
                </Button>
              )}
            </h2>

            <div className="flex flex-col gap-3">
              {list.map((cat) => (
                <Link
                  key={cat.id}
                  className="block"
                  href={`/forum/categories/${cat.slug}`}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer w-full">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                          {cat.imageUrl ? (
                            <img
                              alt={cat.name}
                              className="w-full h-full object-cover"
                              src={cat.imageUrl}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base font-semibold truncate">
                              {cat.name}
                            </h3>
                            {cat._count?.threads !== undefined && (
                              <Badge
                                className="text-[10px] shrink-0"
                                variant="secondary"
                              >
                                {cat._count.threads} тредов
                              </Badge>
                            )}
                          </div>

                          {cat.description && (
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                              {cat.description}
                            </p>
                          )}

                          {Array.isArray(cat.children) &&
                            cat.children.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {cat.children
                                  .slice()
                                  .sort((a: any, b: any) =>
                                    a.name.localeCompare(b.name, "ru"),
                                  )
                                  .map((ch: any) => (
                                    <Badge
                                      key={ch.id}
                                      className="text-[10px]"
                                      variant="outline"
                                    >
                                      {ch.name}
                                    </Badge>
                                  ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </CardContent>
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