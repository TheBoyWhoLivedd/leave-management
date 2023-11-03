// import { LeaveTypesClient } from "../leaveTypes/components/client";
import { connectToDB } from "@/lib/mongoose";
import LeaveType from "@/models/leaveType.model";
// import { LeaveTypeColumn } from "../leaveTypes/components/columns";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { LeaveTypesClient } from "./components/client";
import { LeaveTypeColumn } from "./components/columns";

const LeaveTypes = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }
  await connectToDB();
  const leaveTypes = await LeaveType.find();
  //console.log(leaveTypes);

  const formattedLeaveTypes: LeaveTypeColumn[] = leaveTypes.map(
    (leaveType) => ({
      id: leaveType._id.toString(),
      name: leaveType.LeaveTypeName,
    })
  );
  return (
    <div className="p-4">
      <LeaveTypesClient data={formattedLeaveTypes} />
    </div>
  );
};

export default LeaveTypes;
