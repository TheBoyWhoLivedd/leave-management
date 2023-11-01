import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { revalidatePath } from "next/cache";
import { CustomSession, authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Leave from "@/models/leave.model";

export async function PATCH(
  req: Request,
  { params }: { params: { leaveId: string } }
) {
  const session: CustomSession | null = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }

  const body = await req.json();

  const {
    LeaveType,
    NumOfDays,
    StartLeaveDate,
    EndLeaveDate,
    LeaveDetails,
    Employee,
  } = body;
  // const employeeId = new Types.ObjectId(body.Employee);
  try {
    await connectToDB();

    const existingLeave = await Leave.findById(params.leaveId);

    if (!existingLeave) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (existingLeave.AdminStatus !== "Pending") {
      return NextResponse.json(
        {
          error: true,
          message: "Only leaves with status 'Pending' can be updated.",
        },
        { status: 400 }
      );
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      params.leaveId,
      {
        $set: {
          LeaveType,
          NumOfDays,
          StartLeaveDate,
          EndLeaveDate,
          LeaveDetails,
          Employee,
        },
      },
      { new: true }
    );

    revalidatePath("/dashboard/leaves");
    return NextResponse.json({
      leave: updatedLeave,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to update Leave: ${error.message}`,
        details: error.errors,
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { leaveId: string } }
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

    const existingLeave = await Leave.findById(params.leaveId);

    if (!existingLeave) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (existingLeave.AdminStatus !== "Pending") {
      return NextResponse.json(
        {
          error: true,
          message: "Only leaves with status 'Pending' can be deleted.",
        },
        { status: 400 }
      );
    }

    await existingLeave.remove();

    revalidatePath("/dashboard/leaves");
    return NextResponse.json({
      message: `Leave deleted successfully`,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to delete Leave: ${error.message}`,
        details: error.errors,
      },
      { status: 400 }
    );
  }
}
