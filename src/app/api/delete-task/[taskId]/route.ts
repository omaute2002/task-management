import { NextRequest, NextResponse } from 'next/server';
import TaskModel from '@/model/Task';
import dbConnect from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import mongoose from 'mongoose';

export async function DELETE(request: NextRequest, { params }: { params: { taskId: string } }) {
    const { taskId } = params;
    console.log("taskId: ", taskId);

    if (!taskId) {
        return NextResponse.json({
            success: false,
            message: "Invalid taskId"
        }, {
            status: 400
        });
    }

    await dbConnect();
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({
                success: false,
                message: "Authorization header missing or malformed"
            }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const user = await verifyToken(token);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized to delete task."
            }, { status: 403 });
        }

        // Ensure taskId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return NextResponse.json({
                success: false,
                message: "Invalid taskId format"
            }, { status: 400 });
        }

        const task = await TaskModel.findById(taskId);
        if (!task) {
            return NextResponse.json({
                success: false,
                message: "Task not found"
            }, { status: 404 });
        }

        await TaskModel.findByIdAndDelete(taskId);
        return NextResponse.json({
            success: true,
            message: "Task deleted successfully"
        }, { status: 200 });

    } catch (error) {
        console.error("Error while deleting task", error);
        return NextResponse.json({
            success: false,
            message: "Server error, unable to delete task"
        }, { status: 500 });
    }
}
