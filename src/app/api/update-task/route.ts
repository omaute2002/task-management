import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/User";
import TaskModel from "@/model/Task";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";

export async function PUT(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const taskId = params.taskId;
  console.log("taskid ", taskId);

  if (!taskId) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid taskid",
      },
      {
        status: 400,
      }
    );
  }
  await dbConnect();
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header missing or malformed",
        },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized to delete task.",
        },
        { status: 403 }
      );
    }
    const task = await TaskModel.findById(taskId);
    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    const {title, description, status, priority, dueDate} = await request.json();

    if(!title){
        return NextResponse.json({
            success:false,
            message:"Title is required"
        })
    }
    
    const updatedTaskObject = {
        title, 
        description,
        status,
        priority,
        dueDate
    }
    await TaskModel.findByIdAndUpdate(taskId, updatedTaskObject, {new:true});
    return NextResponse.json({
        success:true,
        message:"Task updated successfully"
    }, {status:200})
  } catch (error) {
    console.error("Error while editing the task", error);
    return NextResponse.json(
      {
        success: false,
        message: "error while editing the task",
      },
      { status: 500 }
    );
  }
}
