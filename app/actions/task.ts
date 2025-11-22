'use server';

import { db } from '@/lib/db';
import { Task } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getTasks(projectId?: string) {
  return db.getTasks(projectId);
}

export async function createTask(data: Omit<Task, 'id'>) {
  const newTask: Task = {
    ...data,
    id: Math.random().toString(36).substring(7),
  };
  db.createTask(newTask);
  revalidatePath('/projects'); // Assuming tasks are viewed in project details
  return newTask;
}

export async function updateTaskStatus(id: string, status: Task['status']) {
  const updatedTask = db.updateTask(id, { status });
  revalidatePath('/projects');
  return updatedTask;
}
