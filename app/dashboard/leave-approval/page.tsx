// import { LeaveApprovalClient } from "../leaves/components/client";
import { connectToDB } from "@/lib/mongoose";
import Leave from "@/models/leave.model";
// import { LeaveColumn } from "../leaves/components/columns";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  CustomSession,
  authOptions,
} from "@/app/api/auth/[...nextauth]/options";
import "@/models/index";
import { LeaveApprovalApprovalClient } from "./components/client";
import { LeaveApprovalColumn } from "./components/columns";
import Employee from "@/models/employee.model";

const LeaveApproval = async () => {
  const session: CustomSession | null = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }
  await connectToDB();

  // Find employees under the logged-in supervisor
  const employeesUnderSupervisor = await Employee.find({
    DirectSupervisor: session?.user?.id,
  });

  //  Extract their IDs
  const employeeIds = employeesUnderSupervisor.map((emp) => emp._id);

  // Find leaves of those employees
  const leaves = await Leave.find({
    Employee: { $in: employeeIds },
    AdminStatus: "Pending",
  })
    .populate({ path: "LeaveType", select: "LeaveTypeName" })
    .populate({ path: "Employee", select: "FirstName LastName" });

  const formattedLeaveApproval: LeaveApprovalColumn[] = leaves.map((leave) => ({
    id: leave._id.toString(),
    leaveType: leave.LeaveType.LeaveTypeName,
    name: `${leave.Employee.FirstName} ${leave.Employee.LastName}`,
    date: new Date(leave.createdAt).toLocaleDateString(
      "en-UK"
    ) as unknown as Date,
    days: leave.NumOfDays,
    details: leave.LeaveDetails,
    status: leave.AdminStatus,
  }));

  return (
    <div className="p-4">
      <LeaveApprovalApprovalClient data={formattedLeaveApproval} />
    </div>
  );
};

export default LeaveApproval;
