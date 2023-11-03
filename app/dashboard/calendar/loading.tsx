"use client";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex flex-col items-center space-y-4 p-8">
      {/* Title Skeleton */}
      <Skeleton className="w-1/3 h-8" />

      {/* Dropdown and Calendar Navigation Skeleton */}
      <div className="flex w-full justify-center items-center">
        {/* <Skeleton className="w-1/4 h-8" /> */}
        <div className="flex space-x-2">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-24 h-8" />
          <Skeleton className="w-8 h-8" />
        </div>
      </div>

      <div className="w-full mt-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="w-full h-4 my-2" />
        ))}
      </div>
    </div>
  );
};

export default Loading;
