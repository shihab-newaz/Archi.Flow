import { Project, Client, Task, User } from '@/types';

// Initial Mock Data
const initialClients: Client[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '555-0101',
    company: 'Tech Corp',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '555-0102',
  },
];

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Modern Loft Renovation',
    clientId: '1',
    status: 'Active',
    phase: 'Design',
    budget: 150000,
    startDate: '2023-10-01',
    address: '123 Main St, Cityville',
  },
  {
    id: '2',
    name: 'Lakeside Cabin',
    clientId: '2',
    status: 'On Hold',
    phase: 'Permitting',
    budget: 300000,
    startDate: '2023-08-15',
    address: '456 Lake Rd, Townsville',
  },
];

const initialTasks: Task[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Finalize Floor Plan',
    status: 'In Progress',
    dueDate: '2023-11-15',
    assignee: 'Architect A',
  },
  {
    id: '2',
    projectId: '1',
    title: 'Select Kitchen Materials',
    status: 'To Do',
    dueDate: '2023-11-20',
    assignee: 'Designer B',
  },
];

const initialUser: User = {
  id: '1',
  name: 'Architect One',
  email: 'architect@example.com',
  avatar: 'https://github.com/shadcn.png',
};

// Simple in-memory store (simulating a DB)
class MockDB {
  private clients: Client[] = [...initialClients];
  private projects: Project[] = [...initialProjects];
  private tasks: Task[] = [...initialTasks];
  private user: User = { ...initialUser };

  // Clients
  getClients() {
    return this.clients;
  }

  getClientById(id: string) {
    return this.clients.find((c) => c.id === id);
  }

  createClient(client: Client) {
    this.clients.push(client);
    return client;
  }

  // Projects
  getProjects() {
    return this.projects;
  }

  getProjectById(id: string) {
    return this.projects.find((p) => p.id === id);
  }

  createProject(project: Project) {
    this.projects.push(project);
    return project;
  }

  updateProject(id: string, data: Partial<Project>) {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...data };
      return this.projects[index];
    }
    return null;
  }

  // Tasks
  getTasks(projectId?: string) {
    if (projectId) {
      return this.tasks.filter((t) => t.projectId === projectId);
    }
    return this.tasks;
  }

  createTask(task: Task) {
    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, data: Partial<Task>) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.tasks[index] = { ...this.tasks[index], ...data };
      return this.tasks[index];
    }
    return null;
  }

  // User
  getUser() {
    return this.user;
  }

  updateUser(data: Partial<User>) {
    this.user = { ...this.user, ...data };
    return this.user;
  }
}

export const db = new MockDB();
