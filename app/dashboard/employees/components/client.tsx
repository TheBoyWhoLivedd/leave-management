"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { EmployeeColumn, employeeColumns } from "./columns";
import { Separator } from "@/components/ui/separator";

interface EmployeesClientProps {
  data: EmployeeColumn[];
}

export const EmployeesClient: React.FC<EmployeesClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Employees (${data.length})`}
          description="Manage your Employees"
        />
        <Button onClick={() => router.push(`/dashboard/employees/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={employeeColumns} data={data} />
    </>
  );
};
