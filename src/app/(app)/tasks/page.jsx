"use client";
import { useState, useEffect } from "react";
import  columns  from "./columns.jsx";
import  DataTable  from "./data-table.jsx";
import axios from "axios";
import { useSession } from "@/context/SessionContext";
import Navbar from "@/components/custom-components/Navbar";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const { sessionInfo } = useSession();
  const { toast } = useToast();
  const [taskData, setTaskData] = useState([]);

  const userId = sessionInfo?.id;
  const username = sessionInfo?.username;
  async function getTaskData() {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No token found");
      }

      if (!userId) {
        throw new Error("No userId found in session");
      }

      console.log("Passed userId", userId);

      // Make the GET request with the Authorization header
      const response = await axios.get(`/api/get-tasks/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
      });

      if (response.data.success) {
        setTaskData(response.data.tasks); // Set the task data
      }
    } catch (error) {
      console.error("Error while getting the task data", error);
      toast({
        title: "Failed",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    }
  }

  // Use effect to fetch data once the sessionInfo is available
  useEffect(() => {
    if (userId) {
      getTaskData();
    }
  }, [userId]); // Fetch tasks when userId is available

  return (
    <>
      <div className="w-full">
        <Navbar />
        <div className="container mx-auto py-10">
          <h1 className="font-semibold  text-xl">Welcome back, {username}</h1>
          <DataTable columns={columns} data={taskData} />
        </div>
      </div>
    </>
  );
}
