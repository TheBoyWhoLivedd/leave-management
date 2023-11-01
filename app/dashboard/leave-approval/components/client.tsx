"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { LeaveApprovalColumn, leaveApprovalColumns } from "./columns";
import { Separator } from "@/components/ui/separator";

interface LeaveApprovalApprovalClientProps {
  data: LeaveApprovalColumn[];
}

export const LeaveApprovalApprovalClient: React.FC<
  LeaveApprovalApprovalClientProps
> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Leave Approvals  (${data.length})`}
          description="Approve or Reject your Subordinate's Leave"
        />
        <Button onClick={() => router.push(`/dashboard/leave/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={leaveApprovalColumns} data={data} />
    </>
  );
};
