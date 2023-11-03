import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Leave from "@/models/leave.model";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../auth/[...nextauth]/options";
import Employee from "@/models/employee.model";

export async function GET(req: Request) {
  const session: CustomSession | null = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 403 });
  }
  //console.log(req.url);
  await connectToDB();

  try {
    const employee = await Employee.findById(session?.user?.id);
    if (!employee) {
      return NextResponse.json(
        {
          error: true,
          message: "No employee found",
        },
        { status: 404 }
      );
    }

    const departmentEmployees = await Employee.find({
      DepartmentId: employee.DepartmentId,
    });

    // Extract employee ids
    const employeeIds = departmentEmployees.map((emp) => emp._id);

    // Define the start and end dates for the month
    const url = new URL(req.url);
    const month = url.searchParams.get("month");
    const year = url.searchParams.get("year");
    if (!month || !year) {
      return NextResponse.json(
        {
          error: true,
          message: "Month or Year parameter is missing or invalid",
        },
        { status: 400 }
      );
    }
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    // Fetch leaves for these employees in the given month and year
    const leaves = await Leave.find({
      Employee: { $in: employeeIds },
      $or: [
        {
          StartLeaveDate: { $lte: endDate },
          EndLeaveDate: { $gte: startDate },
        },
      ],
    });

    // Construct a response
    const response = departmentEmployees.map((emp) => {
      const empLeaves = leaves.filter(
        (leave) => leave.Employee.toString() === emp._id.toString()
      );
      return {
        name: `${emp.FirstName} ${emp.LastName}`,
        leaves: empLeaves,
      };
    });

    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: `Failed to fetch leaves: ${error.message}`,
        details: error.errors,
      },
      { status: 400 }
    );
  }
}
