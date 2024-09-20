'use client'
import {ColumnDef} from "@tanstack/react-table"

export type Task = {
    title: string;
    description?: string;
    status: 'To Do' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
    dueDate?: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}


export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "description",
        header: "Description", 
    },
    {
        accessorKey: "status",
        header: "Status", 
    },
    {
        accessorKey: "priority",
        header: "Priority", 
    },
    {
        accessorKey: "dueDate",
        header: "Due Date", 
    },
    {
        accessorKey: "createdAt",
        header: "Created At", 
    },
    
]