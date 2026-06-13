import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoadedStateProps {
  isLoaded?: boolean;
}

export default function SkeletonLoadedState({
  isLoaded,
}: SkeletonLoadedStateProps) {
  if (isLoaded) {
    return null; // или рендери реальный контент
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <Card className="w-full space-y-5 p-4 rounded-lg">
        {/* Аватар + имя */}
        <div className="max-w-[300px] w-full flex items-center gap-3">
          <Skeleton className="rounded-full w-12 h-12 shrink-0" />
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </div>

        {/* Строки контента */}
        <div className="space-y-3">
          <Skeleton className="h-3 w-3/5 rounded-lg" />
          <Skeleton className="h-3 w-4/5 rounded-lg" />
          <Skeleton className="h-3 w-2/5 rounded-lg" />
        </div>

        {/* Нижний блок */}
        <div className="space-y-3">
          <Skeleton className="h-3 w-16 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-5 rounded-lg" />
            <Skeleton className="h-3 w-5 rounded-lg" />
          </div>
        </div>
      </Card>
    </div>
  );
}