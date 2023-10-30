"use client";

import * as z from "zod";
// import axios from "axios";
import { useState } from "react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { toast } from "react-hot-toast";
import { useToast } from "@/components/ui/use-toast";
import { CaretSortIcon, CheckIcon, TrashIcon } from "@radix-ui/react-icons";
import { useParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import Image from "next/image";
import { defaultAvatarImg } from "@/lib/defaultImage";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  Image: z.string({ required_error: "Image URL cannot be empty" }),
  DepartmentId: z.string().min(1),
  FirstName: z
    .string()
    .min(1, { message: "First Name must be at least 1 character" }),
  LastName: z
    .string()
    .min(1, { message: "Last Name must be at least 1 character" }),
  Gender: z.union([z.literal("Male"), z.literal("Female")], {
    required_error: "Gender is required",
  }),
  Password: z.string().min(1),
  Roles: z.union([
    z.literal("COMMISSIONER_GENERAL"),
    z.literal("COMMISSIONER"),
    z.literal("ASSISTANT_COMMISSIONER"),
    z.literal("MANAGER"),
    z.literal("SUPERVISOR"),
    z.literal("OFFICER"),
  ]),
  DateOfBirth: z.date({ required_error: "Please select a Date of Birth." }),
  SupervisorId: z.string({
    required_error: "Please select a Supervisor.",
  }),
  // Address: z.string({
  //   required_error: "Address is required",
  // }),
  Phone: z
    .string({ required_error: "Phone number is required" })
    .regex(/^0\d{9}$/, { message: "Phone number format is invalid" }),
  Email: z.string().email({ message: "Invalid Email Address" }),
});

type EmployeeFormValues = z.infer<typeof formSchema>;
type Gender = "Male" | "Female";
type Roles =
  | "COMMISSIONER_GENERAL"
  | "COMMISSIONER"
  | "ASSISTANT_COMMISSIONER"
  | "MANAGER"
  | "SUPERVISOR"
  | "OFFICER";

export interface Employee {
  id: string;
  FirstName: string;
  LastName: string;
  Gender: Gender;
  DateOfBirth: Date;
  Address: string;
  Phone: string;
  Email: string;
  Roles: Roles;
  Image: string;
}
export type Department = {
  id: string;
  name: string;
};
export type Supervisor = {
  id: string;
  name: string;
};
interface EmployeeFormProps {
  initialData: Employee | null;
  departments: Department[];
  supervisors: Supervisor[];
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  departments,
  supervisors,
}) => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSupervisorName, setSelectedSupervisorName] = useState("");
  let [PreviewImg, SetPreviewImg] = useState(defaultAvatarImg);

  const title = initialData ? "Edit Employee" : "Add Employee";
  const description = initialData ? "Edit an employee." : "Add a new employee";
  const toastMessage = initialData ? "Employee updated." : "Employee Added.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? initialData
    : {
        FirstName: "",
        LastName: "",
        Gender: "Male" as Gender,
        DateOfBirth: new Date(),
        Address: "",
        Phone: "",
        Email: "",
        Roles: "OFFICER" as Roles,
        Image: "",
        DepartmentId: "",
        Password: "12345",
      };

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        // await axios.patch(`/api/employees/${params.partnerId}`, data);
      } else {
        // await axios.post(`/api/employees`, {
        //   ...data,
        //   path: pathname,
        // });
      }
      router.refresh();
      router.push(`/employees`);
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
        // action: <ToastAction altText="Goto schedule to undo">Retry</ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      // await axios.delete(`/api/employees/${params.partnerId}`);
      router.refresh();
      router.push(`/employees`);
      // toast.success("Partner deleted.");
      toast({
        title: "Success",
        description: "Employee Deleted",
      });
    } catch (error: any) {
      // toast.error(`Error: ${error.message}`);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Error: ${error.message}`,
        // action: <ToastAction altText="Goto schedule to undo">Retry</ToastAction>,
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
          <Image
            //@ts-ignore
            src={(PreviewImg as string) || initialData?.Image}
            alt="EmployeeAvatar"
            width={60}
            height={60}
          />
          <FormField
            control={form.control}
            name="Image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input id="picture" type="file" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="DepartmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
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
                          placeholder="Select a Department"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          <div className="flex items-center">
                            {department.name}
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
              name="FirstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
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
              name="LastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Last Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
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
                          placeholder="What are you?"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Male", "Female"].map((gender, index) => (
                        <SelectItem key={index} value={gender}>
                          <div className="flex items-center">{gender}</div>
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
              name="Phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Phone Number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={loading}
                      placeholder="Default Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
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
                          placeholder="Officer?"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        "COMMISSIONER_GENERAL",
                        "COMMISSIONER",
                        "ASSISTANT_COMMISSIONER",
                        "MANAGER",
                        "SUPERVISOR",
                        "OFFICER",
                      ].map((gender, index) => (
                        <SelectItem key={index} value={gender}>
                          <div className="flex items-center">{gender}</div>
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
              name="DateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between">
                  <FormLabel>Date of birth</FormLabel>
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="SupervisorId"
              render={({ field }) => {
                return (
                  <>
                    <FormItem className="flex flex-col justify-between">
                      <FormLabel>Direct Supervisor</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {selectedSupervisorName ||
                                "Select Direct Supervisor"}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search Supervisors."
                              className="h-9"
                            />
                            <CommandEmpty>No Supervisor found.</CommandEmpty>
                            <CommandGroup>
                              {supervisors.map((supervisor) => (
                                <CommandItem
                                  value={supervisor.name}
                                  key={supervisor.id}
                                  onSelect={() => {
                                    form.setValue(
                                      "SupervisorId",
                                      supervisor.id,
                                      { shouldValidate: true }
                                    );

                                    setSelectedSupervisorName(supervisor.name);
                                  }}
                                >
                                  {supervisor.name}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      supervisor.id == field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  </>
                );
              }}
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
