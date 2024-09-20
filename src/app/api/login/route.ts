import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs';
import { generateToken } from "@/lib/auth";
import { NextResponse, NextRequest } from 'next/server';


export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { email, password } = await request.json();

        const existingUserByEmail = await UserModel.findOne({ email });

        if (!existingUserByEmail) {
            return NextResponse.json({
                success: false,
                message: "User does not exist"
            }, { status: 404 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUserByEmail.password);

        if (isPasswordCorrect) {

            const token = generateToken(existingUserByEmail);
            return NextResponse.json({
                success: true,
                message: "Login successful",
                token
            }, { status: 200 });
        } else {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 401 });
        }
    } catch (error) {
        console.error("Error while logging in", error);
        return NextResponse.json({
            success: false,
            message: "Error while logging in the user"
        }, { status: 500 });
    }
}