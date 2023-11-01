"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { LeaveTypeColumn, leaveTypeColumns } from "./columns";
import { Separator } from "@/components/ui/separator";

interface LeaveTypesClientProps {
  data: LeaveTypeColumn[];
}

export const LeaveTypesClient: React.FC<LeaveTypesClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`LeaveTypes (${data.length})`}
          description="Manage your LeaveTypes"
        />
        <Button onClick={() => router.push(`/dashboard/leave-type/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={leaveTypeColumns} data={data} />
    </>
  );
};
