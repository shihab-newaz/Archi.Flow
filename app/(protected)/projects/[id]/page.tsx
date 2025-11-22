import { getProjectById } from '@/app/actions/project';
import { getTasks } from '@/app/actions/task';
import { PhaseTracker } from '@/components/projects/PhaseTracker';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { TaskBoard } from '@/components/projects/TaskBoard';
import { notFound } from 'next/navigation';

interface ProjectDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  const tasks = await getTasks(id);

  if (!project) {
    notFound();
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
        <TaskBoard tasks={tasks} projectId={project.id} />
      </div>
    </div>
  );
}
