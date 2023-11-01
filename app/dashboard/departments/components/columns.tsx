import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type DepartmentColumn = {
  id: string;
  name: string;

};

export const departmentColumns: ColumnDef<DepartmentColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
