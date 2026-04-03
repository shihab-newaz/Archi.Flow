import { Badge } from '@/components/ui/badge';
import { type Project } from '@/services';
import { CalendarDays, Percent } from 'lucide-react';

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const completion = project.completionPercentage ?? 0;

  return (
    <div className="space-y-4 border-b pb-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.description || 'No description provided.'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={project.status === 'IN_PROGRESS' ? 'default' : 'secondary'} className="text-sm">
            {project.status}
          </Badge>
          <Badge variant="outline" className="text-sm">
            {completion}% complete
          </Badge>
        </div>
      </div>

      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span>
            Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Percent className="h-4 w-4 text-muted-foreground" />
          <span>Open tasks: {project.openTasks ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
