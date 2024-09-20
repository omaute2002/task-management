import dbConnect from "@/lib/dbConnect";
import TaskModel from "@/model/Task";
import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

// POST /api/tasks - Create Task
export async function POST(request: NextRequest) {
    await dbConnect(); // Ensure the MongoDB connection

    try {
        // Extract the Bearer token from Authorization header
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({
                success: false,
                message: "Authorization header missing or malformed"
            }, { status: 401 });
        }

        // Extract and verify the token
        const token = authHeader.split(' ')[1];
        const user = await verifyToken(token); // Verify token and decode user info

        // Log the user payload
        console.log("User Payload:", user);

        if (!user || !user.id) {
            return NextResponse.json({
                success: false,
                message: "Invalid or expired token"
            }, { status: 401 });
        }

        // Parse the incoming request body for task data
        const { title, description, status, priority, dueDate } = await request.json();

        // Check if the required field 'title' is present
        if (!title) {
            return NextResponse.json({
                success: false,
                message: "Title is required"
            }, { status: 400 });
        }

        // Create a new task with the authenticated user's ID as `createdBy`
        const newTask = new TaskModel({
            title,
            description,
            status,
            priority,
            dueDate,
            createdBy: new mongoose.Types.ObjectId(user.id), // Attach the user._id to createdBy field
        });

        // Save the task in the database
        await newTask.save();

        return NextResponse.json({
            success: true,
            message: "Task created successfully",
            task: newTask
        }, { status: 201 });

    } catch (error) {
        console.error("Error while creating task", error);
        return NextResponse.json({
            success: false,
            message: "Server error, unable to create task"
        }, { status: 500 });
    }
}
