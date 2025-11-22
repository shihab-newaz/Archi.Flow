'use client';

import { Task, TaskStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewTaskDialog } from '@/components/projects/NewTaskDialog';

interface TaskBoardProps {
  tasks: Task[];
  projectId: string;
}

const columns: { title: string; status: TaskStatus }[] = [
  { title: 'To Do', status: 'To Do' },
  { title: 'In Progress', status: 'In Progress' },
  { title: 'Done', status: 'Done' },
];

export function TaskBoard({ tasks, projectId }: TaskBoardProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3 h-full">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        return (
          <div key={col.status} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-muted-foreground">{col.title}</h3>
              <Badge variant="secondary" className="rounded-full px-2">
                {colTasks.length}
              </Badge>
            </div>
            
            <div className="flex flex-col gap-3 bg-muted/30 p-2 rounded-lg min-h-[200px]">
               {colTasks.map((task) => (
                 <Card key={task.id} className="cursor-grab active:cursor-grabbing hover:shadow-sm">
                   <CardHeader className="p-4 pb-2">
                     <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                   </CardHeader>
                   <CardContent className="p-4 pt-0">
                     <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                       <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                       {task.assignee && (
                         <span className="bg-secondary px-1.5 py-0.5 rounded">
                           {task.assignee}
                         </span>
                       )}
                     </div>
                   </CardContent>
                 </Card>
               ))}
               <NewTaskDialog projectId={projectId} defaultStatus={col.status} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
