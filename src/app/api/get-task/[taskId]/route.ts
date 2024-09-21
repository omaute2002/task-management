

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TaskModel from '@/model/Task';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: { taskId: string } }) {
    const { taskId } = params;
    console.log("Received taskId:", taskId); // Improved logging

    if (!taskId) {
        return NextResponse.json({
            success: false,
            message: "userId is missing"
        }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
        return NextResponse.json({
            success: false,
            message: "Invalid userId format"
        }, { status: 400 });
    }

    await dbConnect();

    try {
        const task = await TaskModel.findById(taskId);

        if (task?.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No tasks found for this user"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            task
        }, { status: 200 });

    } catch (error) {
        console.error("Error while retrieving tasks", error);
        return NextResponse.json({
            success: false,
            message: "Server error, unable to retrieve tasks"
        }, { status: 500 });
    }
}

