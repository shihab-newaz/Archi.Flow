import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/types';
import { Activity, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface StatsOverviewProps {
  projects: Project[];
}

export function StatsOverview({ projects }: StatsOverviewProps) {
  const activeProjects = projects.filter((p) => p.status === 'Active').length;
  const completedProjects = projects.filter((p) => p.status === 'Completed').length;
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const pendingPermits = projects.filter((p) => p.phase === 'Permitting').length;

  const stats = [
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: Activity,
      description: 'Currently in progress',
    },
    {
      title: 'Total Budget',
      value: `$${totalBudget.toLocaleString()}`,
      icon: DollarSign,
      description: 'Across all projects',
    },
    {
      title: 'Pending Permits',
      value: pendingPermits,
      icon: Clock,
      description: 'Awaiting approval',
    },
    {
      title: 'Completed',
      value: completedProjects,
      icon: CheckCircle,
      description: 'Successfully delivered',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
