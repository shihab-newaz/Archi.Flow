'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types';
import Link from 'next/link';
import { CalendarDays, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col group">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium truncate group-hover:text-primary transition-colors">
                {project.name}
              </CardTitle>
              <Badge variant={project.status === 'Active' ? 'default' : 'secondary'}>
                {project.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-sm text-muted-foreground mb-4">{project.address}</div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="rounded-sm">
                {project.phase}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 text-sm text-muted-foreground flex justify-between">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {new Date(project.startDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {project.budget.toLocaleString()}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
