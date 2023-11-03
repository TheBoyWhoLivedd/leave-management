export const dynamic = "force-dynamic";
import React from "react";
import { EmployeeForm } from "./components/employee-form";
import Employee from "@/models/employee.model";
import Department from "@/models/department.model";
import { connectToDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { employeeId: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }

  await connectToDB();
  let formattedEmployee = null;

  if (params.employeeId !== "new") {
    const employee = await Employee.findOne({
      _id: params.employeeId,
    }).populate("DirectSupervisor");

    formattedEmployee = {
      id: employee._id.toString(),
      FirstName: employee.FirstName,
      LastName: employee.LastName,
      Gender: employee.Gender,
      DateOfBirth: new Date(employee.DateOfBirth),
      Address: employee.Address,
      Phone: employee.Phone,
      Email: employee.Email,
      Roles: employee.Roles,
      Image: employee.Image,
      DepartmentId: employee.DepartmentId.toString(),
      DirectSupervisor: employee.DirectSupervisor
        ? employee.DirectSupervisor._id.toString()
        : "",
      hasAdminRights: employee.hasAdminRights,
    };
  }
  const supervisors = await Employee.find({});
  const formattedSupervisors = supervisors.map((supervisor) => ({
    id: supervisor._id.toString(),
    name: `${supervisor.FirstName} ${supervisor.LastName}`,
  }));
  const departments = await Department.find({});
  const formatteddepartments = departments.map((department) => ({
    id: department._id.toString(),
    name: department.DepartmentName,
  }));

  // console.log(formattedEmployee);
  // console.log(formatteddepartments);
  // console.log(formattedSupervisors);

  return (
    <div className="p-2 md:p-6">
      <EmployeeForm
        initialData={formattedEmployee}
        departments={formatteddepartments}
        supervisors={formattedSupervisors}
      />
    </div>
  );
};

export default page;
