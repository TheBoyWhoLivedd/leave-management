"use client";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { TrashIcon } from "@radix-ui/react-icons";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  LeaveTypeName: z
    .string()
    .min(1, { message: "LeaveType Name must be at least 1 character" }),
  LeaveTypeDetails: z.string(),
  LeaveTypeStatus: z.boolean(),
});

type LeaveTypeFormValues = z.infer<typeof formSchema>;

export type LeaveType = {
  id: string;
  LeaveTypeName: string;
  LeaveTypeDetails: string;
  LeaveTypeStatus: boolean;
};

interface LeaveTypeFormProps {
  initialData: LeaveType | null;
}

export const LeaveTypeForm: React.FC<LeaveTypeFormProps> = ({
  initialData,
}) => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit LeaveType" : "Add LeaveType";
  const description = initialData
    ? "Edit an leaveType."
    : "Add a new leaveType";
  const toastMessage = initialData ? "LeaveType updated." : "LeaveType Added.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? initialData
    : {
        LeaveTypeName: "",
        LeaveTypeDetails: "",
        LeaveTypeStatus: true,
      };

  const form = useForm<LeaveTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: LeaveTypeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/leave-type/${params.leaveTypeId}`, data);
      } else {
        //console.log(data);
        await axios.post(`/api/leave-type`, {
          ...data,
          path: pathname,
        });
      }
      router.refresh();
      router.push(`/dashboard/leave-type`);
      toast({
        title: "Success",
        description: toastMessage,
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
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/leaveTypes/${params.leaveTypeId}`);
      router.refresh();
      router.push(`/dashboard/leaveTypes`);

      toast({
        title: "Success",
        description: "LeaveType Deleted",
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
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="LeaveTypeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LeaveType Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="First Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="LeaveTypeDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LeaveType Details</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Handles Admin Tasks"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="LeaveTypeStatus"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>LeaveType Status</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
