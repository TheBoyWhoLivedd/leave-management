"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { LeaveColumn, leaveColumns } from "./columns";
import { Separator } from "@/components/ui/separator";

interface LeavesClientProps {
  data: LeaveColumn[];
}

export const LeavesClient: React.FC<LeavesClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Leave Applications (${data.length})`}
          description="Manage your Leave Applications"
        />
        <Button onClick={() => router.push(`/dashboard/leave/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={leaveColumns} data={data} />
    </>
  );
};
