import { Skeleton } from "@/components/ui/skeleton";

interface ProfileSkeletonProps {
  isLoaded?: boolean;
}

export default function ProfileSkeleton({ isLoaded }: ProfileSkeletonProps) {
  if (isLoaded) return null;

  return (
    <div className="w-60 flex items-center gap-3">
      <Skeleton className="rounded-full w-12 h-12 shrink-0" />
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
  );
}