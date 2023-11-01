"use client";
import React from "react";
import {
  ClipboardIcon,
  CircleIcon,
  PlusCircledIcon,
  FileIcon,
  PersonIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/app/api/auth/[...nextauth]/options";

export const SidebarRoutes = () => {
  const { data: session } = useSession() as { data: CustomSession | null };
  const isAdmin = session?.user?.isAdmin;
  const path = usePathname();
  console.log("Current Path: ", path);

  type RouteType = {
    title: string;
    href?: string;
    icon: React.JSX.Element;
    label: string;
    isTitle: boolean;
    children?: {
      title: string;
      label: string;
      href: string;
      parentKey: string;
      icon: React.JSX.Element;
    }[];
  };

  const adminRoutes: RouteType[] = [
    {
      title: "Department",
      label: "Department",
      isTitle: false,
      icon: <FileIcon />,
      children: [
        {
          title: "NewDepartment",
          label: "New Department",
          href: "/dashboard/departments/new",
          parentKey: "Department",
          icon: <PlusCircledIcon />,
        },
        {
          title: "DepartmentList",
          label: "Department List",
          href: "/dashboard/departments",
          parentKey: "Department",
          icon: <CircleIcon />,
        },
      ],
    },
    {
      title: "LeaveType",
      label: "Leave Type",
      isTitle: false,
      icon: <ClipboardIcon />,
      children: [
        {
          title: "Leave Type List",
          label: "Leave Type List",
          href: "/dashboard/leave-type",
          parentKey: "LeaveType",
          icon: <CircleIcon />,
        },
        {
          title: "New Leave Type",
          label: "New Leave Type",
          href: "/dashboard/leave-type/new",
          parentKey: "LeaveType",
          icon: <PlusCircledIcon />,
        },
      ],
    },
    {
      title: "Employee",
      label: "Employee",
      isTitle: false,
      icon: <PersonIcon />,
      children: [
        {
          title: "NewEmployee",
          label: "New Employee",
          href: "/dashboard/employees/new",
          parentKey: "Employee",
          icon: <PersonIcon />,
        },
        {
          title: "Employee List",
          label: "Employee List",
          href: "/dashboard/employees",
          parentKey: "Employee",
          icon: <CircleIcon />,
        },
      ],
    },
  ];

  const commonRoutes: RouteType[] = [
    {
      title: "Dashboard",
      label: "Dashboard",
      href: "/dashboard",
      isTitle: false,
      icon: <ClipboardIcon />,
    },
    {
      title: "Leave",
      label: "Leave",
      isTitle: false,
      icon: <ClipboardIcon />,
      children: [
        {
          title: "Leave List",
          label: "Leave List",
          href: "/leave/leave-list",
          parentKey: "Leave",
          icon: <CircleIcon />,
        },
        {
          title: "Leave List Pending",
          label: "Leave List Pending",
          href: "/leave/leave-list-pending",
          parentKey: "Leave",
          icon: <CircleIcon />,
        },
        {
          title: "Leave List Approved",
          label: "Leave List Approved",
          href: "/leave/leave-list-approved",
          parentKey: "Leave",
          icon: <CircleIcon />,
        },
        {
          title: "Leave List Rejected",
          label: "Leave List Rejected",
          href: "/leave/leave-list-rejected",
          parentKey: "Leave",
          icon: <CircleIcon />,
        },
      ],
    },
    {
      title: "Calendar",
      label: "Calendar",
      isTitle: false,
      icon: <CalendarIcon />,
      children: [
        {
          title: "My Calendar",
          label: "My Calendar",
          href: "/calendar/my",
          parentKey: "Calendar",
          icon: <CalendarIcon />,
        },
        {
          title: "Department Calendar",
          label: "Department Calendar",
          href: "/calendar/department",
          parentKey: "Calendar",
          icon: <CalendarIcon />,
        },
      ],
    },
  ];

  const routes = isAdmin ? [...commonRoutes, ...adminRoutes] : commonRoutes;

  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList className="flex flex-col gap-2">
        {routes.map((route) => {
          const isActive = path === route.href;
          if (route.children && route.children.length > 0) {
            return (
              <Accordion
                className="w-full"
                type="single"
                collapsible
                key={route.title}
              >
                <AccordionItem value={route.title}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-1">
                      {route.icon}
                      {route.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {route.children.map((child) => {
                      const isSubActive = path === child.href;
                      return (
                        <Link
                          key={child.title}
                          href={child.href}
                          legacyBehavior
                          passHref
                        >
                          <NavigationMenuItem className="w-full">
                            <NavigationMenuLink
                              className={cn(
                                navigationMenuTriggerStyle(),
                                "flex justify-start gap-2 w-full cursor-pointer text-opacity-50",
                                isSubActive && "text-opacity-100 bg-clicked"
                              )}
                            >
                              {child.icon}
                              {child.title}
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        </Link>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          } else {
            return (
              <Link
                key={route.title}
                href={route.href!}
                legacyBehavior
                passHref
                className="w-full"
              >
                <NavigationMenuItem className="w-full">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "flex justify-start gap-2 w-full cursor-pointer text-opacity-50",
                      isActive && "text-opacity-100 bg-clicked"
                    )}
                  >
                    {route.icon}
                    {route.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </Link>
            );
          }
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
