import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Leave from "@/models/leave.model";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const session: CustomSession | null = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const body = await req.json();
    // console.log(body);

    await connectToDB();
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
