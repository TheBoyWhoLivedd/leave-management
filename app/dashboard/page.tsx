import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
const page = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }

  return <div>{session?.user?.name}</div>;
};

export default page;
