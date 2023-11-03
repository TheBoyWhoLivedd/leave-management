"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { CustomSession } from "@/app/api/auth/[...nextauth]/options";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function UserMenu() {
  const { data: session } = useSession() as { data: CustomSession | null };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className=" h-13 flex items-center space-x-2 "
        >
          <Avatar className="shrink-0">
            <AvatarImage
              src={session?.user?.avatar as string}
              alt={`${session?.user?.name}'s avatar`}
            />
            <AvatarFallback delayMs={600}>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-start">
            <span className="font-medium">{session?.user?.name}</span>
            <span className="font-semibold">{session?.user?.role}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem>
          <Link href="/dashboard/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/dashboard/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            handleSignOut();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
