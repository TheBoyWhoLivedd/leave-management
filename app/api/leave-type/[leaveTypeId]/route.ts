import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import LeaveType from "@/models/leaveType.model";
import { revalidatePath } from "next/cache";
import { CustomSession, authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Leave from "@/models/leave.model";

// PATCH route to update a LeaveType
export async function PATCH(
  req: Request,
  { params }: { params: { leaveTypeId: string } }
) {
  const session: CustomSession | null = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }

  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { LeaveTypeName, LeaveTypeDetails, LeaveTypeStatus } = body;

  try {
    await connectToDB();

    const updatedLeaveType = await LeaveType.findByIdAndUpdate(
      params.leaveTypeId,
      {
        $set: {
          LeaveTypeName,
          LeaveTypeDetails,
          LeaveTypeStatus,
        },
      },
      { new: true }
    );

    if (!updatedLeaveType) {
      return new NextResponse("Not Found", { status: 404 });
    }

    revalidatePath("/dashboard/leaveTypes");
    return NextResponse.json({
      leaveType: updatedLeaveType.LeaveTypeName,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to update LeaveType: ${error.message}`,
        details: error.errors,
      },
      { status: 400 }
    );
  }
}

// DELETE route to delete a LeaveType
export async function DELETE(
  req: Request,
  { params }: { params: { leaveTypeId: string } }
) {
  const session: CustomSession | null = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }

  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const associatedLeaves = await Leave.find({
      LeaveType: params.leaveTypeId,
    });

    if (associatedLeaves.length > 0) {
      return NextResponse.json(
        {
          error: true,
          message: `The leave type is associated with ${associatedLeaves.length} leave(s). Please reassign or remove these leaves before deleting the leave type.`,
        },
        { status: 400 }
      );
    }

    await connectToDB();

    const deletedLeaveType = await LeaveType.findByIdAndDelete(
      params.leaveTypeId
    );

    if (!deletedLeaveType) {
      return new NextResponse("Not Found", { status: 404 });
    }

    revalidatePath("/dashboard/leaveTypes");
    return NextResponse.json({
      message: `LeaveType ${deletedLeaveType.LeaveTypeName} deleted successfully`,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to delete LeaveType: ${error.message}`,
        details: error.errors,
      },
      { status: 400 }
    );
  }
}
