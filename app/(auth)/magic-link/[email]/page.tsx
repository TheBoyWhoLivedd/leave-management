"use client";
import React, { useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

export default function MagicLinkLogin({
  params,
}: {
  params: { email: string };
}) {
  const searchParam = useSearchParams();
  const { toast } = useToast();
  useEffect(() => {
    axios
      .post("/api/auth/magic-link/verify", {
        email: params.email,
        token: searchParam.get("signature"),
      })
      .then((res) => {
        const response = res.data;
        console.log("The response is ", response);
        if (response.status == 200) {
          toast({
            title: "Success",
            description: "Redirecting you the home page.",
            variant: "default",
          });
          signIn("credentials", {
            email: response.email,
            password: "",
            callbackUrl: "/",
            redirect: true,
          });
        } else if (response.status == 400) {
          toast({
            title: "Uh! Something Went Wrong",
            description: response.message,
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        console.log("The error is", err);
      });
  }, []);

  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center">
        <h1>Please wait validating your link.</h1>
      </div>
    </>
  );
}
