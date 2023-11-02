import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { CustomUser } from "./app/api/auth/[...nextauth]/options";

// routes.ts
export const adminRoutes = [
  "/dashboard/departments/new",
  "/dashboard/departments",
  "/dashboard/leave-type",
  "/dashboard/leave-type/new",
  "/dashboard/employees/new",
  "/dashboard/employees",
];

export const commonRoutes = [
  "/dashboard",
  "/dashboard/leave/new",
  "/dashboard/leave",
  "/dashboard/calendar",
  "/dashboard/department-calendar",
  "/dashboard/leave-approval",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname == "/" ||
    pathname == "/forgot-password" ||
    pathname == "/reset-password"
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });
  const user: CustomUser | null = token?.user as CustomUser;

  // If user is not authenticated and tries to access any protected route
  if (
    !token &&
    (commonRoutes.includes(pathname) || adminRoutes.includes(pathname))
  ) {
    return NextResponse.redirect(
      new URL("/?error=Please login first to access this route", request.url)
    );
  }

  // If authenticated user is not an admin and tries to access an admin route
  if (user && !user.isAdmin && adminRoutes.includes(pathname)) {
    return NextResponse.redirect(
      new URL(
        "/?error=You do not have permission to access this route",
        request.url
      )
    );
  }

  return NextResponse.next();
}
