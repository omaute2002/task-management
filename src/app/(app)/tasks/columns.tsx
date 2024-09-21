
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: "To-Do" | "In-Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};

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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const order = ["To-Do", "In-Progress", "Completed"]; // Define the custom order
      const statusA = rowA.getValue("status");
      const statusB = rowB.getValue("status");

      // Compare the indices of status in the custom order array
      return order.indexOf(statusA) - order.indexOf(statusB);
    },
    cell: ({ row }) => {
      const status = row.getValue("status");

      const getStatusColor = (status) => {
        switch (status) {
          case "To-Do":
            return "bg-red-500 text-white";
          case "In-Progress":
            return "bg-yellow-500 text-white";
          case "Completed":
            return "bg-green-500 text-white";
          default:
            return "bg-gray-500 text-white";
        }
      };

      return (
        <Badge
          className={`rounded-full text-xs font-semibold ${getStatusColor(
            status
          )}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const priority = row.getValue("priority");
      const getPriorityStatus = (priority) => {
        switch (priority) {
          case "Low":
            return "bg-green-500 text-white";
          case "Medium":
            return "bg-yellow-500 text-white";
          case "High":
            return "bg-red-500 text-white";
          default:
            return "bg-gray-500 text-white";
        }
      };
      return (
        <Badge
          className={`rounded-full text-xs font-semibold ${getPriorityStatus(
            priority
          )}`}
        >
          {priority}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = new Date(row.getValue("dueDate"));
      const formattedDate = `${dueDate.getFullYear()}-${String(
        dueDate.getDate()
      ).padStart(2, "0")}-${String(dueDate.getMonth() + 1).padStart(2, "0")}`;

      return <span>{formattedDate}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt"));
      const formattedDate = `${createdAt.getFullYear()}-${String(
        createdAt.getDate()
      ).padStart(2, "0")}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
      return <span>{formattedDate}</span>;
    },
    sortingFn: "datetime",
    sortDescFirst: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
    const router = useRouter();
      const task = row.original;
      const token = localStorage.getItem("authToken");
    
      const { toast } = useToast();
      if (!token) {
        toast({
          title: "Authorization Failed",
          description: "Login again",
          variant: "destructive",
        });
      }
      const handleDelete = async () => {
        try {
          const response = await axios.delete(`/api/delete-task/${task._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            toast({
              title: "Task deleted! ",
            });
            location.reload();
          }
        } catch (error) {
          console.error("Error while deleting the task", error);
          toast({
            title: "Failed to delete",
            variant: "destructive",
          });
        }
      };

      
    const handleEdit = () => {
        router.push(`/edit-task/${task._id}`); // Redirect to the edit page
      };


      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </>
      );
    },
  },
];
