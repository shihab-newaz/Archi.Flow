import { getProjects } from '@/app/actions/project';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { NewProjectSheet } from '@/components/projects/NewProjectSheet';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage your architectural portfolio.</p>
        </div>
        <NewProjectSheet />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}
