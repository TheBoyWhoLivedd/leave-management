import React from "react";
import { MobileSidebar } from "./mobile-sidebar";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { UserMenu } from "./user-menu";
// import { CompanyIcon } from "./icons/company-icon";

export const Navbar = () => {

  

  return (
    <div className="p-2 border-b h-full flex items-center shadow-sm backdrop-blur">
      <MobileSidebar />
      <div>
        <Link href="/dashboard" className="flex items-center gap-2 pl-1 md:pl-10">
          {/* <CompanyIcon /> */}
          <span className="text-2xl font-bold tracking-tight">DASHBOARD</span>
        </Link>
      </div>
      <div className=" ml-auto flex gap-3">
        {/* {!userId && (
          <Link href="/sign-in">
            <Button variant="ghost">Login</Button>
          </Link>
        )}
        {userId && (
          <Link href="/admin/partners">
            <Button variant="ghost">Dashboard</Button>
          </Link>
        )} */}
        <UserMenu/>
        <ModeToggle />
      </div>
    </div>
  );
};
