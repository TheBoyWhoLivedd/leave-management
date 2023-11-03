export const dynamic = "force-dynamic";
import React from "react";
import { DepartmentForm } from "./components/department-form";
import Department from "@/models/department.model";
import { connectToDB } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { departmentId: string } }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/server");
  }

  await connectToDB();
  let formattedDepartment = null;

  if (params.departmentId !== "new") {
    const department = await Department.findOne({
      _id: params.departmentId,
    });

    formattedDepartment = {
      id: department._id.toString(),
      DepartmentName: department.DepartmentName,
      DepartmentDetails: department.DepartmentDetails,
      DepartmentStatus: department.DepartmentStatus,
    };
  }

  //console.log(formattedDepartment);
  //console.log(formatteddepartments);

  return (
    <div className="p-2 md:p-6">
      <DepartmentForm initialData={formattedDepartment} />;
    </div>
  );
};
export default page;
