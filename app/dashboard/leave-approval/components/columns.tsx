import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";


export type LeaveApprovalColumn = {
  id: string;
  name: string;
  leaveType: string;
  date: Date;
  days: number;
  details: string;
  status:string
};

export const leaveApprovalColumns: ColumnDef<LeaveApprovalColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "leaveType",
    header: "Leav Approval Type",
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
    accessorKey: "details",
    header: "Leave Details",
  },
  {
    accessorKey: "Status",
    header: "Status",

    cell: ({ row }) => {
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
      return <Badge variant={badgeVariant}>{row.original.status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
