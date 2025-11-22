'use server';

import { db } from '@/lib/db';
import { Project } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getProjects() {
  return db.getProjects();
}

export async function getProjectById(id: string) {
  return db.getProjectById(id);
}

export async function createProject(data: Omit<Project, 'id'>) {
  const newProject: Project = {
    ...data,
    id: Math.random().toString(36).substring(7),
  };
  db.createProject(newProject);
  revalidatePath('/projects');
  return newProject;
}

export async function updateProject(id: string, data: Partial<Project>) {
  const updatedProject = db.updateProject(id, data);
  revalidatePath('/projects');
  revalidatePath(`/projects/${id}`);
  return updatedProject;
}
