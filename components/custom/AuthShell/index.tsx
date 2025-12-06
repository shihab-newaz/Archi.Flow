'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AuthShellProps {
  title: string
  description?: string
  footer?: React.ReactNode
  children: React.ReactNode
  illustration?: React.ReactNode
  className?: string
}

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

function AuthShell({
  children,
  className,
  description,
  footer,
  illustration,
  title,
}: AuthShellProps) {
  return (
    <div className="flex min-h-[100svh] flex-col bg-muted/20 lg:flex-row">
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-primary/10 p-12 lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <motion.div
          className="relative z-10 max-w-lg text-primary-foreground"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          {illustration ?? (
            <div className="space-y-6 text-primary dark:text-primary-foreground">
              <h2 className="text-3xl font-semibold leading-tight lg:text-4xl">
                Empower your learning community
              </h2>
              <p className="text-base text-muted-foreground dark:text-muted">
                Manage admissions, academics, finance, and communication from a
                single, unified LMS dashboard.
              </p>
            </div>
          )}
        </motion.div>
        <div
          className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl"
          aria-hidden
        />
      </div>

      <div className="flex w-full flex-1 items-center justify-center px-6 py-12 sm:px-8">
        <motion.div
          className={cn('w-full max-w-md', className)}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Card className="border-border/60 bg-background/80 shadow-xl backdrop-blur">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
                {title}
              </CardTitle>
              {description ? (
                <CardDescription className="text-muted-foreground">
                  {description}
                </CardDescription>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-6">{children}</CardContent>
            {footer ? (
              <CardFooter className="justify-center text-sm text-muted-foreground">
                {footer}
              </CardFooter>
            ) : null}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export { AuthShell }
export type { AuthShellProps }
