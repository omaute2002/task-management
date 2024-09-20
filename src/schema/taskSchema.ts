import { z } from 'zod';


const statusEnum = ['To Do', 'In Progress', 'Completed'] as const;
const priorityEnum = ['Low', 'Medium', 'High'] as const;


export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(statusEnum, {
    errorMap: () => ({ message: 'Invalid status' }),
  }),
  priority: z.enum(priorityEnum, {
    errorMap: () => ({ message: 'Invalid priority' }),
  }),
  dueDate: z.date().optional().nullable(),
  createdBy: z.string().min(1, 'Created by is required'), // ObjectId of the user
  createdAt: z.date(),
  updatedAt: z.date(),
});

