export type ProjectStatus = 'Active' | 'Completed' | 'On Hold';
export type ProjectPhase = 'Concept' | 'Design' | 'Permitting' | 'Construction';

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: ProjectStatus;
  phase: ProjectPhase;
  budget: number;
  startDate: string;
  endDate?: string;
  address: string;
  thumbnail?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  assignee?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
