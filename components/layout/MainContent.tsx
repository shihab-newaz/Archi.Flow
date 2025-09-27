'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface MainContentProps {
  children: React.ReactNode
  className?: string
}

export default function MainContent({ children, className }: MainContentProps) {
  return (
    <main
      className={cn(
        'flex-1 overflow-y-auto bg-muted/30',
        className
      )}
    >
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {children}
      </div>
    </main>
  )
}