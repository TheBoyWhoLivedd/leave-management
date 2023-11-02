import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";

export const statuses = [
  {
    value: "Accepted",
    label: "Accepted",
  },
  {
    value: "Rejected",
    label: "Rejected",
  },
  {
    value: "Pending",
    label: "Pending",
  },
];

export type LeaveColumn = {
  id: string;
  name: string;
  leaveType: string;
  date: Date;
  days: number;
  status: string;
};

export const leaveColumns: ColumnDef<LeaveColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "leaveType",
    header: "Leave Type",
  },
  {
    accessorKey: "date",
    header: "Application Date",
  },
  {
    accessorKey: "days",
    header: "Days",
  },
  {
    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => {
      // const status = statuses.find(
      //   (stat) => stat.value === row.original.status
      // );
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );
      // console.log(row.original.status);
      if (!status) {
        return null;
      }
      let badgeVariant:
        | "default"
        | "secondary"
        | "destructive"
        | "outline"
        | "accepted";
      switch (row.original.status.toLowerCase()) {
        case "rejected":
          badgeVariant = "destructive";
          break;
        case "pending":
          badgeVariant = "secondary";
          break;
        case "accepted":
          badgeVariant = "accepted";
          break;
        default:
          badgeVariant = "default";
          break;
      }
      return <Badge variant={badgeVariant}>{status.label}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
