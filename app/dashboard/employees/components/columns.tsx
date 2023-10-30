import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";

export type EmployeeColumn = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
};

export const employeeColumns: ColumnDef<EmployeeColumn>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => (
      <div className="flex items-center justify-start">
        <Image
          src={row.original.imageUrl}
          alt={row.original.name}
          className="h-12 w-12 rounded-full"
          width={48}
          height={48}
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
