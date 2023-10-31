import { EmployeesClient } from "./components/client";
import { connectToDB } from "@/lib/mongoose";
import Employee from "@/models/employee.model";
import { EmployeeColumn } from "./components/columns";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const Employees = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }
  await connectToDB();
  const employees = await Employee.find();
  // console.log(employees);

  const formattedEmployees: EmployeeColumn[] = employees.map((employee) => ({
    id: employee._id.toString(),
    name: `${employee.FirstName} ${employee.LastName}`,
    role: employee.Roles,
    imageUrl: employee.Image,
  }));
  return (
    <div className="p-4">
      <EmployeesClient data={formattedEmployees} />
    </div>
  );
};

export default Employees;
