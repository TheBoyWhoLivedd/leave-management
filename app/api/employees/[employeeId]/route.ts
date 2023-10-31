import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Employee from "@/models/employee.model";
import { revalidatePath } from "next/cache";
import { CustomSession, authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: { employeeId: string } }
) {
  const session: CustomSession | null = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }

  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const {
    Address,
    DateOfBirth,
    DepartmentId,
    DirectSupervisor,
    Email,
    FirstName,
    Gender,
    LastName,
    Phone,
    Roles,
  } = body;

  try {
    await connectToDB();

    const updatedEmployee = await Employee.findByIdAndUpdate(
      params.employeeId,
      {
        $set: {
          Address,
          DateOfBirth,
          DepartmentId,
          DirectSupervisor,
          Email,
          FirstName,
          Gender,
          LastName,
          Phone,
          Roles,
        },
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return new NextResponse("Not Found", { status: 404 });
    }

    revalidatePath("/dashboard/employees");
    return NextResponse.json({
      employee: updatedEmployee.FirstName,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to create Employee: ${error.message}`,
        details: error.errors,
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { employeeId: string } }
) {
  const session: CustomSession | null = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        error: true,
        message: `Unauthenticated: You Shall not Pass!`,
      },
      { status: 403 }
    );
  }

  if (!session?.user?.isAdmin) {
    return NextResponse.json(
      {
        error: true,
        message: `Unauthorized: You Shall not Pass!`,
      },
      { status: 401 }
    );
  }

  try {
    await connectToDB();

    // Check if the employee is a direct supervisor of anyone
    const isSupervisor = await Employee.findOne({
      DirectSupervisor: new mongoose.Types.ObjectId(params.employeeId),
    });

    if (isSupervisor) {
      return NextResponse.json(
        {
          error: true,
          message: `The employee is a direct supervisor of atleast ${isSupervisor.FirstName} and cannot be deleted.`,
        },
        { status: 400 }
      );
    }

    // If not a supervisor, proceed to delete
    const deletedEmployee = await Employee.findByIdAndDelete(params.employeeId);

    if (!deletedEmployee) {
      return new NextResponse("Not Found", { status: 404 });
    }

    revalidatePath("/dashboard/employees");
    return NextResponse.json({
      message: `Employee ${deletedEmployee.FirstName} deleted successfully`,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to delete Employee: ${error.message}`,
        details: error.errors,
      },
      { status: 400 }
    );
  }
}
