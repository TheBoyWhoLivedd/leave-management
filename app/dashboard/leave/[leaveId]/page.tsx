export const dynamic = "force-dynamic";
import React from "react";
import { LeaveForm } from "./components/leave-form";
import Leave from "@/models/leave.model";
import LeaveType from "@/models/leaveType.model";
import { connectToDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { leaveId: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }

  await connectToDB();
  let formattedLeave = null;

  if (params.leaveId !== "new") {
    const leave = await Leave.findOne({
      _id: params.leaveId,
    }).populate("LeaveType");

    formattedLeave = {
      id: leave._id.toString(),
      NumOfDays: leave.NumOfDay,
      LeaveType: leave.LeaveType._id.toString(),
      StartLeaveDate: new Date(leave.StartLeaveDate),
      EndLeaveDate: new Date(leave.EndLeaveDate),
      LeaveDetails: leave.LeaveDetails,
    };
  }

  const leaveTypes = await LeaveType.find({});
  const formattedleaveTypes = leaveTypes.map((leaveType) => ({
    id: leaveType._id.toString(),
    name: leaveType.LeaveTypeName,
  }));

  // console.log(formattedLeave);
  // console.log(formattedleaveTypes);
  // console.log(formattedSupervisors);

  return (
    <LeaveForm initialData={formattedLeave} leaveTypes={formattedleaveTypes} />
  );
};

export default page;
