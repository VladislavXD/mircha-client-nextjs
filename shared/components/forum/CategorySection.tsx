"use client";

import type { Category } from "@/src/types/forum.types";

import React from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = { title: string; categories: Category[] };

export default function CategorySection({ title, categories }: Props) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button asChild size="sm" variant="ghost">
          <Link href="/forum">Все категории</Link>
        </Button>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/forum/${cat.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between px-4 pb-0">
                <div>
                  <h3 className="text-lg font-semibold">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground">
                      {cat.description}
                    </p>
                  )}
                </div>
                {cat._count?.threads !== undefined && (
                  <Badge className="shrink-0 ml-2" variant="secondary">
                    {cat._count.threads} тредов
                  </Badge>
                )}
              </CardHeader>

              {cat.children && cat.children.length > 0 && (
                <CardContent className="pt-2 px-4">
                  <div className="flex flex-wrap gap-2">
                    {cat.children.map((ch) => (
                      <Badge key={ch.id} variant="outline">
                        {ch.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}