"use client";
import React, { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "@/context/SessionContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/custom-components/Navbar";

const ItemType = {
  TASK: "task",
};

const initialTasks = {
  "To-Do": [],
  "In-Progress": [],
  "Completed": [],
};

// Draggable Task Component
const Task = ({ task, column, moveTask }) => {
  const [, dragRef] = useDrag({
    type: ItemType.TASK,
    item: { id: task._id, column },
  });

  return (
    <div
      ref={dragRef}
      className="bg-white p-4 mb-2 rounded-lg shadow hover:shadow-lg transition-all"
    >
      <h4 className="font-semibold text-lg">{task.title}</h4>
      <p className="text-gray-600">{task.description}</p>
    </div>
  );
};

const Column = ({ column, tasks, moveTask }) => {
  const [, dropRef] = useDrop({
    accept: ItemType.TASK,
    drop: (item) => moveTask(item.id, column),
  });

  return (
    <div ref={dropRef} className="w-1/3 p-4 bg-gray-100 rounded-lg shadow-md gap-4">
      <h3 className="text-xl font-bold mb-2 text-center">{column}</h3>
      {tasks.map((task) => (
        <Task key={task._id} task={task} column={column} moveTask={moveTask} />
      ))}
    </div>
  );
};

const KanbanBoard = () => {
  const { toast } = useToast();
  const { sessionInfo } = useSession();
  const userId = sessionInfo?.id;
  const username = sessionInfo?.username;
  const router = useRouter();
  const [tasks, setTasks] = useState(initialTasks);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`/api/get-tasks/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const taskObj = { "To-Do": [], "In-Progress": [], "Completed": [] };

        response.data.tasks.forEach((task) => {
          taskObj[task.status].push(task);
        });

        setTasks(taskObj);
        toast({ title: "Successfully fetched tasks" });
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      toast({ title: "Failed to load tasks", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const moveTask = async (taskId, destinationColumn) => {
    const task = Object.values(tasks).flat().find((t) => t._id === taskId);

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      const sourceColumn = task.status;

      updatedTasks[sourceColumn] = updatedTasks[sourceColumn].filter(
        (t) => t._id !== taskId
      );

      updatedTasks[destinationColumn] = [
        ...updatedTasks[destinationColumn],
        { ...task, status: destinationColumn },
      ];

      return updatedTasks;
    });

    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        "/api/update-status",
        { id: taskId, status: destinationColumn },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({ title: "Status updated successfully" });
    } catch (error) {
      console.error("Failed to update task status", error);
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container w-full max-w-full justify-center">
        <div className="ml-4 mt-10 text-3xl font-semibold">
          <h2 className="ml-10">Welcome to Kanban Dashboard, {username}</h2>
          <Button
            className="ml-10 mt-5 hover:bg-white hover:text-black"
            onClick={() => router.push("/tasks")}
          >
            Tasks Table
          </Button>
        </div>
        <DndProvider backend={HTML5Backend}>
          <div id="kanban-card" className="flex lg:flex-row sm:flex-col xs:flex-col xs:max-w-full mt-10 gap-4 mx-10">
            {["To-Do", "In-Progress", "Completed"].map((column) => (
              <Column
                key={column}
                column={column}
                tasks={tasks[column]}
                moveTask={moveTask}
              />
            ))}
          </div>
        </DndProvider>
      </div>
    </>
  );
};

export default KanbanBoard;
