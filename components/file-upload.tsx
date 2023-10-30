"use client";
import { UploadDropzone, UploadButton } from "@/lib/uploadthing";
import { OurFileRouter, ourFileRouter } from "@/app/api/uploadthing/core";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  const { toast } = useToast();
  useEffect(() => {
    // Define the callback function for the observer
    const callback = (
      mutationsList: MutationRecord[],
      observer: MutationObserver
    ) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "childList" &&
          mutation.target instanceof HTMLElement
        ) {
          // If a child is added, check for the button
          const button = mutation.target.querySelector(
            'button[data-ut-element="button"]'
          );
          if (button) {
            button.classList.remove("text-white");
            console.log("Removed 'text-white' class from the button");

            // Optionally, disconnect the observer if you want to stop observing after the first match
            observer.disconnect();
          }
        }
      }
    };

    // Create a new observer instance
    const observer = new MutationObserver(callback);

    // Start observing the parent div for child additions
    const parentDiv = document.querySelector(
      ".border.border-gray-500.rounded-md.p-1"
    );
    if (parentDiv) {
      observer.observe(parentDiv, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="border border-gray-500 rounded-md p-1">
      {/* Changing this class will cause the UseEffect above to stop working. If you want to change it,do the same in the useEfffect*/}

      {/* @ts-expect-error*/}
      <UploadDropzone
        className=" gap-2"
        endpoint={endpoint}
        onClientUploadComplete={(res: any) => {
          onChange(res?.[0].url);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          toast({
            title: "Uh! Something Went Wrong",
            description: error?.message,
            variant: "destructive",
          });
        }}
      />
    </div>
  );
};
