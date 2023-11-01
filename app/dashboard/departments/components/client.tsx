"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { DepartmentColumn, departmentColumns } from "./columns";
import { Separator } from "@/components/ui/separator";

interface DepartmentsClientProps {
  data: DepartmentColumn[];
}

export const DepartmentsClient: React.FC<DepartmentsClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Departments (${data.length})`}
          description="Manage your Departments"
        />
        <Button onClick={() => router.push(`/dashboard/departments/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={departmentColumns} data={data} />
    </>
  );
};
