'use client'

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useProjectPhasesQuery, useProjectQuery, useTasksQuery } from '@/services';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectMembersPanel } from '@/components/projects/ProjectMembersPanel';
import { PhaseManager } from '@/components/projects/PhaseManager';
import { TaskBoard } from '@/components/projects/TaskBoard';

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const projectId = Array.isArray(params?.id) ? params?.id?.[0] : params?.id;
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);

  const { data: project, isLoading: projectLoading, isError: projectError } =
    useProjectQuery(projectId ?? '', Boolean(projectId));
  const { data: phases = [] } = useProjectPhasesQuery(projectId ?? '', Boolean(projectId));

  const sortedPhases = useMemo(
    () => [...phases].sort((a, b) => a.position - b.position),
    [phases]
  );

  useEffect(() => {
    if (!activePhaseId && sortedPhases.length > 0) {
      setActivePhaseId(sortedPhases[0].id);
    }
  }, [activePhaseId, sortedPhases]);

  const { data: tasks = [], isLoading: tasksLoading } = useTasksQuery(
    {
      phaseId: activePhaseId ?? undefined,
      page: 1,
      limit: 100,
    },
    Boolean(activePhaseId)
  );

  if (projectLoading) {
    return <div className="text-sm text-muted-foreground">Loading project...</div>;
  }

  if (projectError || !project) {
    return <div className="text-sm text-destructive">Project not found.</div>;
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      <ProjectHeader project={project} />

      <ProjectMembersPanel projectId={project.id} />

      <PhaseManager projectId={project.id} onActivePhaseChange={setActivePhaseId} />

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Tasks</h2>
          {sortedPhases.length > 0 && (
            <span className="text-sm text-muted-foreground">
              Active phase: {sortedPhases.find((phase) => phase.id === activePhaseId)?.name || '-'}
            </span>
          )}
        </div>

        {!activePhaseId ? (
          <div className="text-sm text-muted-foreground">Create a phase to start adding tasks.</div>
        ) : tasksLoading ? (
          <div className="text-sm text-muted-foreground">Loading tasks...</div>
        ) : (
          <TaskBoard tasks={tasks} phaseId={activePhaseId} />
        )}
      </div>
    </div>
  );
}
