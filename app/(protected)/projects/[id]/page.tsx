'use client'

import { useParams } from 'next/navigation';
import { useProjectQuery, useTasksQuery } from '@/services';
import { PhaseTracker } from '@/components/projects/PhaseTracker';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { TaskBoard } from '@/components/projects/TaskBoard';

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const projectId = Array.isArray(params?.id) ? params?.id?.[0] : params?.id;
  const { data: project, isLoading: projectLoading, isError: projectError } =
    useProjectQuery(projectId ?? '', Boolean(projectId));
  const { data: tasks = [], isLoading: tasksLoading } = useTasksQuery(projectId, Boolean(projectId));

  if (projectLoading) {
    return <div className="text-sm text-muted-foreground">Loading project...</div>;
  }

  if (projectError || !project) {
    return <div className="text-sm text-destructive">Project not found.</div>;
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      <ProjectHeader project={project} />
      
      <div className="py-4">
        <PhaseTracker currentPhase={project.phase} />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
        </div>
        {tasksLoading ? (
          <div className="text-sm text-muted-foreground">Loading tasks...</div>
        ) : (
          <TaskBoard tasks={tasks} projectId={project.id} />
        )}
      </div>
    </div>
  );
}
