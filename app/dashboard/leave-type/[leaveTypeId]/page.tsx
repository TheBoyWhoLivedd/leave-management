export const dynamic = "force-dynamic";
import React from "react";
import { LeaveTypeForm } from "./components/leaveType-form";
import LeaveType from "@/models/leaveType.model";
import { connectToDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { leaveTypeId: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }

  await connectToDB();
  let formattedLeaveType = null;

  if (params.leaveTypeId !== "new") {
    const leaveType = await LeaveType.findOne({
      _id: params.leaveTypeId,
    });

    formattedLeaveType = {
      id: leaveType._id.toString(),
      LeaveTypeName: leaveType.LeaveTypeName,
      LeaveTypeDetails: leaveType.LeaveTypeDetails,
      LeaveTypeStatus: leaveType.LeaveTypeStatus,
    };
  }

  // console.log(formattedLeaveType);
  // console.log(formattedleaveTypes);

  return (
    <div className="p-2 md:p-6">
      <LeaveTypeForm initialData={formattedLeaveType} />;
    </div>
  );
};

export default page;
