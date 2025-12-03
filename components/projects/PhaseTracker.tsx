'use client';

import { ProjectPhase } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface PhaseTrackerProps {
  currentPhase: ProjectPhase;
}

const phases: ProjectPhase[] = ['Concept', 'Design', 'Permitting', 'Construction'];

export function PhaseTracker({ currentPhase }: PhaseTrackerProps) {
  const currentIndex = phases.indexOf(currentPhase);

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -z-10" />
      <div className="flex justify-between">
        {phases.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={phase} className="flex flex-col items-center gap-2 bg-background px-2">
              <div
                className={cn(
                  'h-8 w-8 rounded-full border-2 flex items-center justify-center transition-colors',
                  isCompleted || isCurrent
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground bg-background text-muted-foreground'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {phase}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
