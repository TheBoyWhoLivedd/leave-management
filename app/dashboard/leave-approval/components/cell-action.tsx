"use client";

import axios from "axios";
import {
  CopyIcon,
  Pencil2Icon,
  DotsHorizontalIcon,
  TrashIcon,
  CheckIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LeaveApprovalColumn } from "./columns";

interface CellActionProps {
  data: LeaveApprovalColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const { toast } = useToast();
  const onDecision = async (approve: boolean) => {
    try {
      setLoading(true);
      await axios.patch(`/api/leave-approval/${data.id}`, { approve });
      router.refresh();
      toast({
        title: "Success",
        description: approve ? "Leave Approved" : "Leave Rejected",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      console.error(errorMessage);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Error: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
      setOpen(false)
    }
  };

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    // toast.success("Product ID copied to clipboard.");
    toast({
      title: "Success",
      description: "Product ID copied to clipboard.",
      // action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
    });
  };
  const isPending = data.status.toLowerCase() === "pending";
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDecision(false)}
        loading={loading}
      />
      {isPending ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onCopy(data.id)}>
              <CopyIcon className="mr-2 h-4 w-4" /> Copy Id
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDecision(true)}>
              <CheckIcon className="mr-2 h-4 w-4" /> Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Cross2Icon className="mr-2 h-4 w-4" /> Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </>
  );
};
