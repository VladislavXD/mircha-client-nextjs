import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* ProfileHeader Skeleton */}
      <Card className="w-full p-0 overflow-hidden rounded-lg">
        <Skeleton className="h-48 md:h-64 w-full" />

        <div className="px-4 sm:px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 sm:-mt-20 mb-4 w-32 sm:w-40">
            <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 rounded-full" />
          </div>

          {/* Name and Username */}
          <div className="mb-4 space-y-2">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <Skeleton className="h-5 w-32 rounded-lg" />
          </div>

          {/* Bio */}
          <div className="mb-4 space-y-2">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-4/5 rounded-lg" />
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-4">
            <Skeleton className="h-5 w-20 rounded-lg" />
            <Skeleton className="h-5 w-20 rounded-lg" />
            <Skeleton className="h-5 w-20 rounded-lg" />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* About Card */}
        <div className="md:col-span-1">
          <Card className="w-full p-4 rounded-lg">
            <CardContent className="p-0 space-y-4">
              <Skeleton className="h-6 w-24 rounded-lg" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-4/5 rounded-lg" />
                <Skeleton className="h-4 w-3/5 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Card */}
        <div className="md:col-span-2">
          <Card className="w-full p-4 rounded-lg">
            <CardContent className="p-0 space-y-4">
              <Skeleton className="h-6 w-32 rounded-lg" />

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="space-y-3 border-b border-border pb-4 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32 rounded-lg" />
                      <Skeleton className="h-3 w-20 rounded-lg" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-lg" />
                    <Skeleton className="h-4 w-5/6 rounded-lg" />
                  </div>

                  {item % 2 === 0 && (
                    <Skeleton className="h-48 w-full rounded-lg" />
                  )}

                  <div className="flex gap-4">
                    <Skeleton className="h-8 w-16 rounded-lg" />
                    <Skeleton className="h-8 w-16 rounded-lg" />
                    <Skeleton className="h-8 w-16 rounded-lg" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}