import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import LeaveType from "@/models/leaveType.model";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../auth/[...nextauth]/options";
import { revalidatePath } from "next/cache";

// GET route to fetch all LeaveTypes
export async function POST(req: Request) {
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

    const createdLeaveType = await LeaveType.create({
      LeaveTypeName,
      LeaveTypeDetails,
      LeaveTypeStatus,
    });

    revalidatePath("/dashboard/leave-type");
    return NextResponse.json({
      leaveType: createdLeaveType.LeaveTypeName,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to create LeaveType: ${error.message}`,
        details: error.errors,
      },
      { status: 400 }
    );
  }
}
