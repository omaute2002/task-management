

import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    // Check if user already exists
    const existingUserByEmail = await UserModel.findOne({
      email,
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        {
          status: 409,
        }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return NextResponse.json(
      {
        success: true,
        message: "User registered Successfully.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error while registring user", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while registering the user",
      },
      {
        status: 500,
      }
    );
  }
}
