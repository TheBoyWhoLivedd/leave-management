import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../api/auth/[...nextauth]/options";
import { connectToDB } from "@/lib/mongoose";
import LeaveBalance from "@/models/leaveBalance.model";

const page = async () => {
  const session: CustomSession | null = await getServerSession(authOptions);
  //console.log(session);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }
  await connectToDB();
  const { Balance } = await LeaveBalance.findOne({
    Employee: session?.user?.id,
  });

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  return (
    <div className="shadow hover:shadow-lg dark:shadow-lg dark:bg-slate-900 rounded-lg p-6 mx-auto max-w-2xl mt-10">
      <h6 className="text-gray-500 text-xs font-medium uppercase tracking-wider">
        {today}
      </h6>
      <h1 className="text-2xl font-semibold mt-2">
        Welcome {session?.user?.name}
      </h1>
      <p className=" mt-4">
        You have <span className="font-semibold">{Balance}</span> days of Leave
        left
      </p>
    </div>
  );
};

export default page;
