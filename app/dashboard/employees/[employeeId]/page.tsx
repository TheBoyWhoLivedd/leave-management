import React from "react";
import { EmployeeForm } from "./components/employee-form";
import Employee from "@/models/employee.model";
import Department from "@/models/department.model";

const page = async ({ params }: { params: { employeeId: string } }) => {
  let formattedEmployee = null;

  if (params.employeeId !== "new") {
    const employee = await Employee.findOne({ _id: params.employeeId });

    formattedEmployee = {
      id: employee._id.toString(),
      FirstName: employee.FirstName,
      LastName: employee.LastName,
      Gender: employee.Gender,
      DateOfBirth: employee.DateOfBirth,
      Address: employee.Address,
      Phone: employee.Phone,
      Email: employee.Email,
      Roles: employee.Roles,
      Image: employee.Image,
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
    <EmployeeForm
      initialData={formattedEmployee}
      departments={formatteddepartments}
      supervisors={formattedSupervisors}
    />
  );
};

export default page;
