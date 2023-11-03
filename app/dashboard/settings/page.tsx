import { EmployeesClient } from "../employees/components/client";
import { connectToDB } from "@/lib/mongoose";
import Employee from "@/models/employee.model";
import { EmployeeColumn } from "../employees/components/columns";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const Employees = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }
  await connectToDB();
  const employees = await Employee.find();
  // console.log(employees);


  return (
    <div className="p-4">
      <p>TO-DO</p>
    </div>
  );
};

export default Employees;
