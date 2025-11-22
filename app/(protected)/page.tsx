import { getProjects } from '@/app/actions/project';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { StatsOverview } from '@/components/dashboard/StatsOverview';

export default async function DashboardPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your architectural projects.</p>
      </div>
      
      <StatsOverview projects={projects} />

      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Projects</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
