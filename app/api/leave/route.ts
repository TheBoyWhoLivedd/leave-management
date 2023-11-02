import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Leave from "@/models/leave.model";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";
import LeaveBalance from "@/models/leaveBalance.model";

export async function POST(req: Request) {
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
