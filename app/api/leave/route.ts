import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Leave from "@/models/leave.model";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";
import LeaveBalance from "@/models/leaveBalance.model";

export async function POST(req: Request) {
  function isDateRangeOverlapping(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): boolean {
    return start1 <= end2 && end1 >= start2;
  }

  try {
    const session: CustomSession | null = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const body = await req.json();

    await connectToDB();

    const leaveBalance = await LeaveBalance.findOne({
      Employee: body.Employee,
    });
    if (!leaveBalance) {
      return NextResponse.json(
        {
          error: true,
          message: "Leave balance not found for the employee.",
        },
        { status: 404 }
      );
    }

    // Ensure the requested leave days do not exceed the available balance
    if (body.NumOfDays > leaveBalance.Balance) {
      return NextResponse.json(
        {
          error: true,
          message: "Requested days exceed available leave balance.",
        },
        { status: 400 }
      );
    }

    // Check for any overlapping leave requests with "Pending" status
    const overlappingLeaves = await Leave.find({
      Employee: body.Employee,
      AdminStatus: "Pending",
      $or: [
        {
          StartLeaveDate: { $lte: body.EndLeaveDate },
          EndLeaveDate: { $gte: body.StartLeaveDate },
        },
        {
          StartLeaveDate: { $lte: body.StartLeaveDate },
          EndLeaveDate: { $gte: body.EndLeaveDate },
        },
      ],
    });

    if (overlappingLeaves.length > 0) {
      return NextResponse.json(
        {
          error: true,
          message:
            "You have a pending leave request that overlaps with the requested date range.",
        },
        { status: 400 }
      );
    }

    const createdLeave = await Leave.create(body);
    revalidatePath("/dashboard/leave");
    return NextResponse.json({
      leave: createdLeave.FirstName,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to create Leave: ${error.message}`,
        details: error.errors,
      },
      { status: 400 }
    );
  }
}
