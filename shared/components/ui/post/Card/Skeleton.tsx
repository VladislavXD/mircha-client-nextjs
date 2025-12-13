import React from "react";
import {Card, Skeleton, Button} from "@heroui/react";



interface SkeletonLoadedStateProps {
	isLoaded?: boolean;
}
export default function SkeletonLoadedState({ isLoaded }: SkeletonLoadedStateProps) {

  return (
    <div className="flex flex-col gap-3 w-full">
      <Card className="w-full space-y-5 p-4" radius="lg">
         <div className="max-w-[300px] w-full flex items-center gap-3" >
      <div>
        <Skeleton className="flex rounded-full w-12 h-12" isLoaded={isLoaded} />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" isLoaded={isLoaded} />
        <Skeleton className="h-3 w-4/5 rounded-lg" isLoaded={isLoaded} />
      </div>
    </div>
       
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg" isLoaded={isLoaded}>
            <div className="h-3 w-full rounded-lg bg-secondary" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg" isLoaded={isLoaded}>
            <div className="h-3 w-full rounded-lg bg-secondary-300" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg" isLoaded={isLoaded}>
            <div className="h-3 w-full rounded-lg bg-secondary-200" />
          </Skeleton>
        </div>
        <div className="space-y-3">
           <Skeleton className="w-16 rounded-lg " isLoaded={isLoaded}>
            <div className="h-3 w-full rounded-lg bg-secondary-300" />
           </Skeleton>
         <div className="flex gap-2">
             <Skeleton className="w-5 rounded-lg " isLoaded={isLoaded}>
            <div className="h-3 w-full rounded-lg bg-secondary-300" />
           </Skeleton>
          <Skeleton className="w-5 rounded-lg " isLoaded={isLoaded}>
            <div className="h-3 w-full rounded-lg bg-secondary-300" />
           </Skeleton>
         </div>
        </div>
      </Card>
    </div>
  );
}

