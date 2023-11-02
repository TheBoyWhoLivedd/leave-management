// import { connectToDB } from "@/lib/mongoose";
// import Employee from "@/models/employee.model";
// import LeaveBalance from "@/models/leaveBalance.model";
// import { NextResponse } from "next/server";

// export asyncs function POST(req: Request) {
//   try {
//     await connectToDB();
//     const allEmployees = await Employee.find();
//     for (let employee of allEmployees) {
//       const existingBalance = await LeaveBalance.findOne({
//         Employee: employee._id,
//       });
//       if (!existingBalance) {
//         const newBalance = new LeaveBalance({
//           Employee: employee._id,
//           Balance: 20,
//         });
//         await newBalance.save();
//       }
//     }
//     return NextResponse.json({
//       message: "Leave balances initialized",
//       revalidated: true,
//       now: Date.now(),
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         error: true,
//         message: `Failed to initialize balances: ${error.message}`,
//         details: error.errors,
//       },
//       { status: 400 }
//     );
//   }
// }

export async function POST(req: Request) {}
