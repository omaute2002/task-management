// src/app/api/tasks/[userId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import TaskModel from '@/model/Task';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = params;
    console.log("Received userId:", userId); // Improved logging

    if (!userId) {
        return NextResponse.json({
            success: false,
            message: "userId is missing"
        }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({
            success: false,
            message: "Invalid userId format"
        }, { status: 400 });
    }

    await dbConnect();

    try {
        const tasks = await TaskModel.find({ createdBy: userId });

        if (tasks.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No tasks found for this user"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            tasks
        }, { status: 200 });

    } catch (error) {
        console.error("Error while retrieving tasks", error);
        return NextResponse.json({
            success: false,
            message: "Server error, unable to retrieve tasks"
        }, { status: 500 });
    }
}

