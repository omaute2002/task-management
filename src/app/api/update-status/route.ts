import dbConnect from "@/lib/dbConnect";
import TaskModel from "@/model/Task";
import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";


export async function PUT(request:NextRequest){
    await dbConnect();
    try {
        const authHeader = request.headers.get("authorization");
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return NextResponse.json({
                success:false,
                message:"Authorization header missing or malformed"
            },{
                status:401
            })
        }
        const token = authHeader.split(" ")[1];
        const user = await verifyToken(token);
        if(!user){
            return NextResponse.json(
                {
                  success: false,
                  message: "Unauthorized to update status.",
                },
                { status: 403 }
              );
        }
        const {id, status} = await request.json();
        await TaskModel.findByIdAndUpdate(id,{status});
        return NextResponse.json({
            success:true,
            message:"Task status updated successfully"
        }, {
            status:201
        })
    } catch (error) {
        console.error("Error while updating the task", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while updating the task",
      },
      { status: 500 }
    );
    }
}