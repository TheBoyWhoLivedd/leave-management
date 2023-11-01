// import { DepartmentsClient } from "../departments/components/client";
import { connectToDB } from "@/lib/mongoose";
import Department from "@/models/department.model";
// import { DepartmentColumn } from "../departments/components/columns";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { DepartmentColumn } from "./components/columns";
import { DepartmentsClient } from "./components/client";

const Departments = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }
  await connectToDB();
  const departments = await Department.find();
  // console.log(departments);

  const formattedDepartments: DepartmentColumn[] = departments.map(
    (department) => ({
      id: department._id.toString(),
      name: department.DepartmentName,
    })
  );
  return (
    <div className="p-4">
      <DepartmentsClient data={formattedDepartments} />
    </div>
  );
};

export default Departments;
