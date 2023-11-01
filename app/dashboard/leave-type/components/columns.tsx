import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type LeaveTypeColumn = {
  id: string;
  name: string;

};

export const leaveTypeColumns: ColumnDef<LeaveTypeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
