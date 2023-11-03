"use client";
import { useState } from "react";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  Email: z.string().email({ message: "Invalid Email Address" }),
  Password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const { toast } = useToast();
  const togglePasswordVisibility = () => {
    setPasswordVisible((prevVisible) => !prevVisible);
  };

  const router = useRouter();

  const form = useForm<LoginFormValues>({
    defaultValues: {
      Email: "admin@example.com",
      Password: "12345",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const { Email, Password } = data;
    try {
      const res = await signIn("credentials", {
        Email,
        Password,
        callbackUrl: "/dashboard",
        redirect: true,
      });

      if (!res) {
        toast({
          title: "Error",
          description: "Unknown error occurred",
          variant: "destructive",
        });
        return;
      }

      console.log(res);

      if (!res.ok) {
        console.log(res.error);
        toast({
          title: "Unauthorized",
          description: "Invalid credentials",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "User Logged In",
        variant: "default",
      });
      router.replace("dashboard");
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-[500px] h-[400px]"
      >
        <Card className="mx-auto max-w-3xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Employee Login</CardTitle>
            <CardDescription>Enter Credentials</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <FormField
                  control={form.control}
                  name="Password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={isPasswordVisible ? "text" : "password"}
                            className="pr-6"
                            {...field}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-2 flex items-center"
                          >
                            {isPasswordVisible ? (
                              <EyeOpenIcon />
                            ) : (
                              <EyeNoneIcon />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={isLoading} type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
