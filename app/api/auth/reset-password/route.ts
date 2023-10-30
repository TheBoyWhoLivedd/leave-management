import Employee from "@/models/employee.model";
import { NextRequest, NextResponse } from "next/server";
import Cryptr from "cryptr";
import Env from "@/app/config/env";
import { connectToDB } from "@/lib/mongoose";
import bcrypt from "bcryptjs";

connectToDB();

export async function POST(request: NextRequest) {
  const payload: ResetPasswordPayload = await request.json();

  if (payload.password !== payload.password_confirmation) {
    return NextResponse.json({
      status: 400,
      message: "Passwords do not match",
    });
  }

  // * Decrypt string
  const crypter = new Cryptr(Env.SECRET_KEY);
  const email = crypter.decrypt(payload.email);

  const user = await Employee.findOne({
    Email: email,
    password_reset_token: payload.signature,
  });

  if (user == null || user == undefined) {
    return NextResponse.json({
      status: 400,
      message: "Reset url is not correct. pls double check it .",
    });
  }

  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(payload.password, salt);
  user.password_reset_token = null;
  await user.save();

  return NextResponse.json({
    status: 200,
    message: "Password changed successfully. please login with new password.",
  });
}
