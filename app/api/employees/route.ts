import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Employee from "@/models/employee.model";
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

    if (!session?.user?.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log(body);

    if (!body.Image) {
      delete body.Image;
    }

    if (!body.Password) {
      body.Password = "12345";
    }

    if (typeof body.DirectSupervisor === "string") {
      body.DirectSupervisor = new mongoose.Types.ObjectId(
        body.DirectSupervisor
      );
    }

    const saltRounds = 10;
    body.Password = bcrypt.hashSync(body.Password, saltRounds);

    connectToDB();
    const createdEmployee = await Employee.create(body);
    revalidatePath("/dashboard/employees");
    return NextResponse.json({
      employee: createdEmployee.FirstName,
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
