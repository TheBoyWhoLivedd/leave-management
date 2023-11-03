"use client";
import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

export default function MagicLink() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    axios
      .post("/api/auth/magic-link", { email: email })
      .then((res) => {
        setLoading(false);
        const response = res.data;
        if (response.status == 400) {
          setErrors(response.errors);
        } else if (response.status == 200) {
          toast({
            title: "Success",
            description: response.message,
            variant: "default",
          });
        } else if (response.status == 500) {
          toast({
            title: "Uh! Something Went Wrong",
            description: response.message,
            variant: "destructive",
          });
        }
      })
      .catch((err) => {
        setLoading(false);

        console.log("The error is", err);
      });
  };

  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="w-[500px] rounded-lg shadow-md p-5">
          <h1 className="font-bold text-2xl">Magic Link</h1>
          <form onSubmit={handleSubmit}>
            <div className="mt-5">
              <input
                type="email"
                className="h-10 rounded-lg outline-purple-400 border w-full p-2"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="text-red-500">{errors?.email}</span>
            </div>
            <div className="mt-5">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white rounded-lg p-2"
                disabled={loading}
              >
                {loading ? "Processing.." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
