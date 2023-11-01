import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Department from "@/models/department.model";
import { revalidatePath } from "next/cache";
import { CustomSession, authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Employee from "@/models/employee.model";

export async function PATCH(
  req: Request,
  { params }: { params: { departmentId: string } }
) {
  const session: CustomSession | null = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }

  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const { DepartmentName, DepartmentDetails, DepartmentStatus } = body;

  try {
    await connectToDB();

    const updatedDepartment = await Department.findByIdAndUpdate(
      params.departmentId,
      {
        $set: {
          DepartmentName,
          DepartmentDetails,
          DepartmentStatus,
        },
      },
      { new: true }
    );

    if (!updatedDepartment) {
      return new NextResponse("Not Found", { status: 404 });
    }

    revalidatePath("/dashboard/departments");
    return NextResponse.json({
      department: updatedDepartment.DepartmentName,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to update Department: ${error.message}`,
        details: error.errors,
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { departmentId: string } }
) {
  const session: CustomSession | null = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }

  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await connectToDB();
    const associatedEmployees = await Employee.find({
      DepartmentId: params.departmentId,
    });

    if (associatedEmployees.length > 0) {
      return NextResponse.json(
        {
          error: true,
          message: `The department is associated with ${associatedEmployees.length} employee(s). Reassign or remove these employees before deleting the department.`,
        },
        { status: 400 }
      );
    }
    
    const deletedDepartment = await Department.findByIdAndDelete(
      params.departmentId
    );

    if (!deletedDepartment) {
      return new NextResponse("Not Found", { status: 404 });
    }

    revalidatePath("/dashboard/departments");
    return NextResponse.json({
      message: `Department ${deletedDepartment.DepartmentName} deleted successfully`,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to delete Department: ${error.message}`,
        details: error.errors,
      },
      { status: 400 }
    );
  }
}
