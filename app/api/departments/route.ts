import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Department from "@/models/department.model";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const session: CustomSession | null = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!session?.user?.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log(body);

    connectToDB();
    const createdDepartment = await Department.create(body);
    revalidatePath("/dashboard/departments");
    return NextResponse.json({
      department: createdDepartment.DepartmentName,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to create Department: ${error.message}`,
        details: error.errors,
      },
      { status: 400 }
    );
  }
}
