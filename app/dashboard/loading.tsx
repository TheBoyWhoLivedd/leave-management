"use client";

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="shadow hover:shadow-lg dark:shadow-lg dark:bg-slate-900 rounded-lg p-6 mx-auto max-w-2xl mt-10">
      {/* Date Skeleton */}
      <Skeleton className="w-2/3 h-4 mb-2" />

      {/* Welcome User Skeleton */}
      <Skeleton className="w-1/2 h-6 mt-2" />

      {/* Leave Balance Skeleton */}
      <Skeleton className="w-3/4 h-6 mt-4" />
    </div>
  );
};

export default Loading;
