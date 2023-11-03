"use client";
import * as z from "zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { differenceInCalendarDays, format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { TrashIcon } from "@radix-ui/react-icons";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/app/api/auth/[...nextauth]/options";

const formSchema = z.object({
  LeaveType: z.string().min(1),
  NumOfDays: z.number(),
  StartLeaveDate: z.date({ required_error: "Please select a Start Date." }),
  EndLeaveDate: z.date({ required_error: "Please select a End Date." }),
  LeaveDetails: z
    .string({
      required_error: "Leave Details are required",
    })
    .min(1),
});

type LeaveFormValues = z.infer<typeof formSchema>;

export interface Leave {
  id: string;
  NumOfDays: number;
  StartLeaveDate: Date;
  EndLeaveDate: Date;
  LeaveType: string;
  LeaveDetails: string;
}
export type LeaveType = {
  id: string;
  name: string;
};

interface LeaveFormProps {
  initialData: Leave | null;
  leaveTypes: LeaveType[];
}

export const LeaveForm: React.FC<LeaveFormProps> = ({
  initialData,
  leaveTypes,
}) => {
  const { toast } = useToast();
  const { data: session } = useSession() as { data: CustomSession | null };
  const Employee = session?.user?.id;
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Leave" : "Add Leave";
  const description = initialData ? "Edit an employee." : "Add a new employee";
  const toastMessage = initialData ? "Leave updated." : "Leave Added.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? initialData
    : {
        LeaveTypeId: "",
        NumOfDays: 0,
        EndDate: new Date(),
        StartDate: new Date(),
        LeaveDetails: "",
      };

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { setValue, watch } = form;
  const startDate = watch("StartLeaveDate");
  const endDate = watch("EndLeaveDate");

  useEffect(() => {
    if (startDate && endDate) {
      let numOfWorkingDays = 0;
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          // This is not a weekend day
          numOfWorkingDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      setValue("NumOfDays", numOfWorkingDays);
    }
  }, [startDate, endDate, setValue]);

  const onSubmit = async (data: LeaveFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/leave/${params.leaveId}`, {
          ...data,
          Employee,
        });
      } else {
        console.log(data);
        await axios.post(`/api/leave`, {
          ...data,
          Employee,
          path: pathname,
        });
        // await axios.post(`/api/leave`, {
        //   ...data,
        //   Employee,
        //   path: pathname,
        // });
      }
      router.refresh();
      router.push(`/dashboard/leave`);
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
      await axios.delete(`/api/leave/${params.leaveId}`);
      router.refresh();
      router.push(`/dashboard/leave`);

      toast({
        title: "Success",
        description: "Leave Deleted",
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
              name="LeaveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Leave Type"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {leaveTypes.map((leaveType) => (
                        <SelectItem key={leaveType.id} value={leaveType.id}>
                          <div className="flex items-center">
                            {leaveType.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="StartLeaveDate"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={field.onChange}
                        disabled={loading}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="EndLeaveDate"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(startDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="NumOfDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Num of Days</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading || true}
                      placeholder="2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="LeaveDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Details</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Sippin' Mai tais on the beach"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
