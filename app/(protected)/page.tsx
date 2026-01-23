'use client'

import { useProjectsQuery } from '@/services';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { PageTransition, StaggerItem } from '@/components/ui/PageTransition';

export default function DashboardPage() {
  const { data: projects = [], isLoading, isError } = useProjectsQuery();

  if (isLoading) {
    return (
      <PageTransition className="space-y-12 p-8">
        <div className="text-sm text-muted-foreground">Loading dashboard...</div>
      </PageTransition>
    );
  }

  if (isError) {
    return (
      <PageTransition className="space-y-12 p-8">
        <div className="text-sm text-destructive">Failed to load dashboard data.</div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-12 p-8">
      <StaggerItem>
        <div className="flex flex-col gap-2 border-b border-border pb-6">
          <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-primary font-display">
            Dashboard
          </h2>
          <p className="text-lg text-muted-foreground font-mono uppercase tracking-widest pl-1">
            Architectural Projects Overview
          </p>
        </div>
      </StaggerItem>
      
      <StaggerItem>
        <StatsOverview projects={projects} />
      </StaggerItem>

      <StaggerItem className="space-y-8">
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-semibold font-display">Recent Projects</h3>
          <span className="text-sm font-mono text-muted-foreground border border-border px-3 py-1 bg-background">
            {projects.length} ACTIVE
          </span>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </StaggerItem>
    </PageTransition>
  );
}
