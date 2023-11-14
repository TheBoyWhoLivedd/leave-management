import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const DepartmentsFormLoading = () => {
  return (
    <div className="space-y-6 w-full px-6 pt-6">
      {/* Heading */}
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-3 w-[300px]" />
      </div>

      <Separator />

      {/* Form Skeleton */}
      <div className="space-y-4 w-full">
        <div className="md:grid md:grid-cols-2 gap-6">
          {/* Leave Type */}
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <div className="relative rounded-md">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="absolute top-1/2 right-3 h-5 w-5 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Number of Days */}
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-full" />
          </div>

          {/* Start Date & End Date */}
          <div className="md:grid md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <div className="relative rounded-md">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="absolute top-1/2 right-3 h-5 w-5 transform -translate-y-1/2" />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <div className="relative rounded-md">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="absolute top-1/2 right-3 h-5 w-5 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <div className="relative rounded-md">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="absolute top-1/2 right-3 h-5 w-5 transform -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <div className="relative rounded-md">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="absolute top-1/2 right-3 h-5 w-5 transform -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Leave Details */}
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>

        {/* Create Button */}
        <div className="flex justify-start mt-4">
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
    </div>
  );
};

export default DepartmentsFormLoading;
