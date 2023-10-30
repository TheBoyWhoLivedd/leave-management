"use client";
import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPassword({
  params,
}: {
  params: { email: string };
}) {
  const searchParam = useSearchParams();
  const { toast } = useToast();
  const router = useRouter();
  const [authState, setAuthState] = useState({
    password: "",
    cpassword: "",
  });
  const [loading, setLoading] = useState(false);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (authState.password !== authState.cpassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    axios
      .post("/api/auth/reset-password", {
        email: params.email,
        signature: searchParam.get("signature"),
        password: authState.password,
        password_confirmation: authState.cpassword,
      })
      .then((res) => {
        const response = res.data;
        if (response.status == 400) {
          toast({
            title: "Uh! Something Went Wrong",
            description: response.message,
            variant: "destructive",
          });
        } else if (response.status == 200) {
          toast({
            title: "Success",
            description: response.message,
            variant: "default",
          });
          router.replace("/");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("err..", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="w-[500px] p-5 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">Reset Passowrd ?</h1>

          <form onSubmit={submit}>
            <div className="mt-5">
              <label className="block">Password</label>
              <Input
                type="password"
                placeholder="Enter your new password"
                className="w-full h-10 p-2 border rounded-md outline-red-400"
                onChange={(event) =>
                  setAuthState({ ...authState, password: event.target.value })
                }
              />
            </div>
            <div className="mt-5">
              <label className="block">Confirm Password</label>
              <Input
                type="password"
                placeholder="Enter your confirm password"
                className="w-full h-10 p-2 border rounded-md outline-red-400"
                onChange={(event) =>
                  setAuthState({ ...authState, cpassword: event.target.value })
                }
              />
            </div>
            <div className="mt-5">
              <Button className="w-full" disabled={loading}>
                {loading ? "Processing.." : "Submit"}
              </Button>
            </div>
            <div className="mt-5 text-center">
              <Link href="/" className="text-orange-400">
                {" "}
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
