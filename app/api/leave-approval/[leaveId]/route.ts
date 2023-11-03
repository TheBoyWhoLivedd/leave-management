import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { revalidatePath } from "next/cache";
import { CustomSession, authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import Leave from "@/models/leave.model";
import LeaveBalance from "@/models/leaveBalance.model";

export async function PATCH(
  req: Request,
  { params }: { params: { leaveId: string } }
) {
  const session: CustomSession | null = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }

  const body = await req.json();

  const { approve } = body;
  const decision = approve ? "Accepted" : "Rejected";
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
          message:
            "Only leaves with status 'Pending' can be Approved/Rejected.",
        },
        { status: 400 }
      );
    }

    if (approve) {
      const leaveBalance = await LeaveBalance.findOne({
        Employee: existingLeave.Employee,
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
      if (leaveBalance.Balance < existingLeave.NumOfDays) {
        return NextResponse.json(
          {
            error: true,
            message:
              "Can't approve leave as it exceeds employee's leave balance",
          },
          { status: 404 }
        );
      }
      leaveBalance.Balance -= existingLeave.NumOfDays;
      await leaveBalance.save();
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      params.leaveId,
      {
        AdminStatus: decision,
      },
      { new: true }
    );

    revalidatePath("/dashboard/leave-approval");
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
