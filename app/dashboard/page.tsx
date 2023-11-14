import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../api/auth/[...nextauth]/options";
import { connectToDB } from "@/lib/mongoose";
import LeaveBalance from "@/models/leaveBalance.model";
import LeaveChart from "@/components/leave-chart";
import Leave from "@/models/leave.model";
import { Types } from "mongoose";
const page = async () => {
  const session: CustomSession | null = await getServerSession(authOptions);
  //console.log(session);
  if (!session || !session.user || !session.user.id) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }
  await connectToDB();
  const leaveBalanceRecord = await LeaveBalance.findOne({
    Employee: session?.user?.id,
  });

  // console.log("balance", leaveBalanceRecord);
  const leaveBalance = leaveBalanceRecord ? leaveBalanceRecord.Balance : 0;

  const userId = new Types.ObjectId(session?.user?.id);
  // console.log("UserID for aggregation:", userId);

  const leavesTaken = await Leave.aggregate([
    {
      $match: {
        Employee: userId,
        AdminStatus: "Accepted",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$NumOfDays" },
      },
    },
  ]);

  // console.log("Leaves Taken:", leavesTaken);

  const totalLeavesTaken = leavesTaken.length > 0 ? leavesTaken[0].total : 0;

  const leaveData = {
    labels: ["Leave Taken", "Leave Balance"],
    datasets: [
      {
        data: [totalLeavesTaken, leaveBalance],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  return (
    <div className="flex flex-col gap-2 justify-center items-center w-full">
      <div className="shadow hover:shadow-lg dark:shadow-lg dark:bg-slate-900 rounded-lg p-6 mx-auto max-w-2xl mt-10 w-full">
        <h6 className="text-gray-500 text-xs font-medium uppercase tracking-wider">
          {today}
        </h6>
        <h1 className="text-2xl font-semibold mt-2">
          Welcome {session?.user?.name}
        </h1>
        <p className=" mt-4">
          You have <span className="font-semibold">{leaveBalance}</span> days of
          Leave left
        </p>
      </div>
      <LeaveChart leaveData={leaveData} />
    </div>
  );
};

export default page;
