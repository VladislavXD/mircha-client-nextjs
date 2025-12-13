import {Skeleton} from "@heroui/react";


interface ProfileSkeletonProps {
	isLoaded?: boolean;
}
export default function ProfileSkeleton({ isLoaded }: ProfileSkeletonProps) {
  return (
    <div className=" w-60 flex items-center gap-3">
      <div>
        <Skeleton className="flex rounded-full w-12 h-12" isLoaded={isLoaded} />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" isLoaded={isLoaded} />
        <Skeleton className="h-3 w-4/5 rounded-lg" isLoaded={isLoaded} />
      </div>
    </div>
  );
}
