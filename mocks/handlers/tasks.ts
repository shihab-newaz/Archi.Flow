import { http, HttpResponse } from 'msw'
import type { Task } from '@/types'
import { createMockTask } from '../factories'

let tasks: Task[] = [
  createMockTask({
    id: '1',
    projectId: '1',
    title: 'Finalize Floor Plan',
    status: 'In Progress',
    dueDate: '2023-11-15',
    assignee: 'Architect A',
  }),
  createMockTask({
    id: '2',
    projectId: '1',
    title: 'Select Kitchen Materials',
    status: 'To Do',
    dueDate: '2023-11-20',
    assignee: 'Designer B',
  }),
]

export const taskHandlers = [
  http.get('/api/tasks', ({ request }) => {
    const url = new URL(request.url)
    const projectId = url.searchParams.get('projectId')
    const results = projectId
      ? tasks.filter((task) => task.projectId === projectId)
      : tasks
    return HttpResponse.json(results)
  }),

  http.post('/api/tasks', async ({ request }) => {
    const payload = (await request.json()) as Omit<Task, 'id'>
    const task: Task = {
      ...payload,
      id: Math.random().toString(36).slice(2, 9),
    }
    tasks = [task, ...tasks]
    return HttpResponse.json(task, { status: 201 })
  }),
]
