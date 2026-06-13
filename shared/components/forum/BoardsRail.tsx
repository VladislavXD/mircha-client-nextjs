"use client";

import type { Board } from "@/src/types/types";

import React from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = { boards: Board[] };

export default function BoardsRail({ boards }: Props) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Boards</h2>
      </div>

      <div className="w-full overflow-x-auto pb-2 [mask-image:linear-gradient(to_right,black_85%,transparent_100%)]">
        <div className="flex gap-3">
          {boards.map((board) => (
            <Link key={board.id} href={`/forum/${board.name}`}>
              <Card className="min-w-[240px] hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row justify-between items-start px-4 pb-0">
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
                      <Badge variant="destructive" className="text-xs">
                        18+
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {board._count?.threads || 0}
                    </Badge>
                  </div>
                </CardHeader>

                {board.description && (
                  <CardContent className="pt-2 px-4">
                    <p className="text-xs text-muted-foreground break-words">
                      {board.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}