import React from "react";
import { Skeleton } from "@heroui/react";

export default function ProfileHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar Skeleton */}
      <Skeleton className="rounded-full">
        <div className="w-10 h-10 rounded-full bg-default-300" />
      </Skeleton>
      
      {/* Name and Username Skeleton */}
      <div className="space-y-2">
        <Skeleton className="w-24 rounded-lg">
          <div className="h-4 w-24 rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="w-16 rounded-lg">
          <div className="h-3 w-16 rounded-lg bg-default-200" />
        </Skeleton>
      </div>
    </div>
  );
}
