'use client'

import { motion } from 'framer-motion'

const DashboardHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-lg border border-border bg-card p-6 text-left shadow-sm"
    >
      <h2 className="text-lg font-semibold text-foreground">Quick start</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Replace this placeholder with your institution&apos;s dashboard widgets
        and analytics.
      </p>
    </motion.div>
  )
}

export { DashboardHero }
