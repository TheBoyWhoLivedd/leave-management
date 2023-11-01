// import { LeavesClient } from "../leaves/components/client";
import { connectToDB } from "@/lib/mongoose";
import Leave from "@/models/leave.model";
// import { LeaveColumn } from "../leaves/components/columns";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "@/app/api/auth/[...nextauth]/options";
import "@/models/index";
import { LeavesClient } from "./components/client";
import { LeaveColumn } from "./components/columns";

const Leaves = async () => {
  const session:CustomSession | null = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }
  await connectToDB();
  const leaves = await Leave.find({ Employee: session?.user?.id })
    .populate({path:"LeaveType", select:"LeaveTypeName"})
    .populate({ path: "Employee", select: "FirstName LastName" });
  console.log(leaves);

  const formattedLeaves: LeaveColumn[] = leaves.map((leave) => ({
    id: leave._id.toString(),
    leaveType: leave.LeaveType.LeaveTypeName,
    name: `${leave.Employee.FirstName} ${leave.Employee.LastName}`,
    date: new Date(leave.createdAt).toLocaleDateString(
      "en-UK"
    ) as unknown as Date,
    days: leave.NumOfDays,
    status: leave.AdminStatus,
  }));
  return (
    <div className="p-4">
      <LeavesClient data={formattedLeaves} />
    </div>
  );
};

export default Leaves;
