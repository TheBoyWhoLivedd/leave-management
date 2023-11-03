import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const Loading = () => {
  return (
    <div className="space-y-6 w-full px-6 pt-6">
      {/* Heading */}
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-3 w-[300px]" />
      </div>

      {/* Employee Image */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-60 w-60 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </div>

      <Separator />

      {/* Form Skeleton */}
      <div className="space-y-6 w-full">
        <div className="md:grid md:grid-cols-2 gap-6">
          {/* Department, First Name, Email, Role */}
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          ))}

          {/* Last Name, Gender, Phone, Address */}
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          ))}

          {/* Default Password, Supervisor, Date of Birth */}
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          ))}

          {/* Checkbox */}
          <div className="flex items-center space-x-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-start mt-6">
          <Skeleton className="h-10 w-[120px] rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
