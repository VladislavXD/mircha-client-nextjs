import { Skeleton } from "@/components/ui/skeleton"

export const PostSkeleton = () => (
  <div className="p-4 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>
    <Skeleton className="h-48 w-full rounded-xl" />
    <div className="flex gap-3">
      <Skeleton className="h-7 w-16 rounded-full" />
      <Skeleton className="h-7 w-16 rounded-full" />
      <Skeleton className="h-7 w-16 rounded-full" />
    </div>
  </div>
)

export const CommentsSkeleton = () => (
  <div className="p-3 space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900">
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    ))}
  </div>
)