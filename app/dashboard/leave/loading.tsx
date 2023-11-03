"use client";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex flex-col space-y-8 p-6 w-full">
      {/* Heading, Search Bar, and Add New Button */}
      <div className="flex items-center justify-between w-full">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-3 w-[400px]" />
        </div>
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>

      <Separator />
      {/* Search and Status Button Skeleton */}
      <div className="flex gap-2 items-center  w-full">
        <Skeleton className="h-6 w-[250px] rounded-md" />     {/* Search Bar */}
        <Skeleton className="h-6 w-[150px] rounded-md" />     {/* Status Button */}
      </div>


      {/* DataTable Skeleton */}
      <div className="space-y-4 w-full">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="flex space-x-4 w-full justify-between">
            <Skeleton className="h-4 w-1/5" />     {/* Name */}
            <Skeleton className="h-4 w-1/5" />     {/* Leave Type */}
            <Skeleton className="h-4 w-1/5" />     {/* Application Date */}
            <Skeleton className="h-4 w-1/5" />     {/* Days */}
            <Skeleton className="h-4 w-1/5" />     {/* Status */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
