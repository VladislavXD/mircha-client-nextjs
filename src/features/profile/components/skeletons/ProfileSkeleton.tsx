import React from "react";
import { Card, Skeleton } from "@heroui/react";

export default function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* ProfileHeader Skeleton */}
      <Card className="w-full p-0 overflow-hidden" radius="lg">
        {/* Background Image Skeleton */}
        <Skeleton className="w-full">
          <div className="h-48 md:h-64 w-full bg-default-300" />
        </Skeleton>

        {/* Profile Info Section */}
        <div className="px-4 sm:px-6 pb-6">
          {/* Avatar Skeleton */}
          <div className="relative -mt-16 sm:-mt-20 mb-4 w-32 sm:w-40">
            <Skeleton className="rounded-full w-32 h-32 sm:w-40 sm:h-40">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-default-300 border-4 border-background" />
            </Skeleton>
          </div>

          {/* Name and Username */}
          <div className="mb-4 space-y-2">
            <Skeleton className="w-48 rounded-lg">
              <div className="h-7 w-48 rounded-lg bg-default-300" />
            </Skeleton>
            <Skeleton className="w-32 rounded-lg">
              <div className="h-5 w-32 rounded-lg bg-default-200" />
            </Skeleton>
          </div>

          {/* Bio Skeleton */}
          <div className="mb-4 space-y-2">
            <Skeleton className="w-full rounded-lg">
              <div className="h-4 w-full rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-4 w-4/5 rounded-lg bg-default-200" />
            </Skeleton>
          </div>

          {/* Stats (Followers, Following, Posts) */}
          <div className="flex gap-6 mb-4">
            <Skeleton className="w-20 rounded-lg">
              <div className="h-5 w-20 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-20 rounded-lg">
              <div className="h-5 w-20 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-20 rounded-lg">
              <div className="h-5 w-20 rounded-lg bg-default-200" />
            </Skeleton>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Skeleton className="w-32 rounded-lg">
              <div className="h-10 w-32 rounded-lg bg-default-300" />
            </Skeleton>
            <Skeleton className="w-32 rounded-lg">
              <div className="h-10 w-32 rounded-lg bg-default-300" />
            </Skeleton>
          </div>
        </div>
      </Card>

      {/* Profile Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* About Card Skeleton */}
        <div className="md:col-span-1">
          <Card className="w-full p-4 space-y-4" radius="lg">
            <Skeleton className="w-24 rounded-lg">
              <div className="h-6 w-24 rounded-lg bg-default-300" />
            </Skeleton>
            <div className="space-y-3">
              <Skeleton className="w-full rounded-lg">
                <div className="h-4 w-full rounded-lg bg-default-200" />
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-4 w-4/5 rounded-lg bg-default-200" />
              </Skeleton>
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-4 w-3/5 rounded-lg bg-default-200" />
              </Skeleton>
            </div>
          </Card>
        </div>

        {/* Activity Card Skeleton */}
        <div className="md:col-span-2">
          <Card className="w-full p-4 space-y-4" radius="lg">
            <Skeleton className="w-32 rounded-lg">
              <div className="h-6 w-32 rounded-lg bg-default-300" />
            </Skeleton>
            
            {/* Post Skeletons */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-3 border-b border-divider pb-4 last:border-b-0">
                {/* Post Header */}
                <div className="flex items-center gap-3">
                  <Skeleton className="rounded-full">
                    <div className="w-10 h-10 rounded-full bg-default-300" />
                  </Skeleton>
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-32 rounded-lg">
                      <div className="h-4 w-32 rounded-lg bg-default-200" />
                    </Skeleton>
                    <Skeleton className="w-20 rounded-lg">
                      <div className="h-3 w-20 rounded-lg bg-default-100" />
                    </Skeleton>
                  </div>
                </div>
                
                {/* Post Content */}
                <div className="space-y-2">
                  <Skeleton className="w-full rounded-lg">
                    <div className="h-4 w-full rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-5/6 rounded-lg">
                    <div className="h-4 w-5/6 rounded-lg bg-default-200" />
                  </Skeleton>
                </div>
                
                {/* Post Image (optional) */}
                {item % 2 === 0 && (
                  <Skeleton className="w-full rounded-lg">
                    <div className="h-48 w-full rounded-lg bg-default-300" />
                  </Skeleton>
                )}
                
                {/* Post Actions */}
                <div className="flex gap-4">
                  <Skeleton className="w-16 rounded-lg">
                    <div className="h-8 w-16 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-16 rounded-lg">
                    <div className="h-8 w-16 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-16 rounded-lg">
                    <div className="h-8 w-16 rounded-lg bg-default-200" />
                  </Skeleton>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

