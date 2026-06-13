"use client";
import type { Board } from "@/src/features/forum";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  boards: Board[];
  pageSize?: number;
};

export default function BoardsList({ boards, pageSize = 10 }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil((boards?.length || 0) / pageSize));
  const pageBoards = useMemo(() => {
    const start = (page - 1) * pageSize;

    return (boards || []).slice(start, start + pageSize);
  }, [boards, page, pageSize]);

  if (!boards || boards.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Boards</h2>
        <div className="hidden sm:flex items-center gap-3 text-sm text-foreground-500">
          <span>Всего: {boards.length}</span>
          <span>
            Стр. {page} / {totalPages}
          </span>
        </div>
      </div>

      {/* Полноширинная адаптивная сетка карточек */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pageBoards.map((board) => (
          <Link key={board.id} className="block" href={`/forum/${board.name}`}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex justify-between items-start px-4 pt-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold text-blue-600 break-words">
                    /{board.name}/
                  </h3>
                  <p className="text-sm font-medium break-words">
                    {board.title}
                  </p>
                </div>
                <div className="flex flex-col gap-1 ml-2 shrink-0">
                  {board.isNsfw && (
                    <Badge className="text-xs px-2 py-1" variant="destructive">18+</Badge>
                  )}
                  <Badge className="text-xs px-2 py-1" variant="outline">{board._count?.threads || 0}</Badge>
                </div>
              </CardHeader>
              {board.description && (
                <CardContent className="pt-2 px-4 pb-4">
                  <p className="text-sm text-foreground-500 line-clamp-3 break-words">
                    {board.description}
                  </p>
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-foreground-500">
            Показано {pageBoards.length} из {boards.length}. Страница {page} из {totalPages}
          </div>
          <div className="flex gap-2 items-center">
            <Button size="sm" variant="ghost" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>
              Назад
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}>
              Вперёд
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
