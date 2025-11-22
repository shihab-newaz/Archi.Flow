import { Badge } from '@/components/ui/badge';
import { Project } from '@/types';
import { CalendarDays, DollarSign, MapPin } from 'lucide-react';

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="space-y-4 border-b pb-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            {project.address}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={project.status === 'Active' ? 'default' : 'secondary'} className="text-sm">
            {project.status}
          </Badge>
          <Badge variant="outline" className="text-sm">
            {project.phase}
          </Badge>
        </div>
      </div>

      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span>Budget: ${project.budget.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
