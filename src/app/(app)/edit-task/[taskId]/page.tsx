"use client"
import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useParams } from "next/navigation";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token =  localStorage.getItem("authToken");
//   console.log(token);
  
  const taskId = params.taskId;

  useEffect(() => {
    console.log("useEffect triggered");
    const taskId = params.taskId;

    const fetchTask = async () => {
      if (taskId) {
        try {
          const response = await axios.get(`/api/get-task/${taskId}`);
          if (response.data.success) {
            setTask(response.data.task);
            setTitle(response.data.task.title);
            setDescription(response.data.task.description);
            setStatus(response.data.task.status);
            setPriority(response.data.task.priority);
            setDueDate(response.data.task.dueDate.slice(0, 10));
          }
        } catch (error) {
          toast({
            title: "Failed to load task",
            variant: "destructive",
          });
          console.error('Error fetching task:', error);
        }
      }
    };

    fetchTask();
  }, [params.taskId]);

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      title: "",
      description: "",
      dueDate: "",
    };

    if (!title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
      valid = false;
    }
    if (!dueDate.trim()) {
      newErrors.dueDate = "Due Date is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await axios.put('/api/update-task', {
        taskId,
        title,
        description,
        status,
        priority,
        dueDate,
      }, {
        headers:{
            Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        toast({
          title: "Task updated",
        });
        router.replace("/tasks");
      }
    } catch (error) {
      console.error("Failed to update the task", error);
      toast({
        title: "Failed to update the task",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <Card className="w-[350px] bg-white">
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
          <CardDescription>Update your task details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Title of your task" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Description of your task" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="To-Do">To Do</SelectItem>
                    <SelectItem value="In-Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type='date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>
            <CardFooter className="flex justify-between mt-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : ("Save Changes")}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
