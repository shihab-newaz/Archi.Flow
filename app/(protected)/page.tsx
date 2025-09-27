import type { Metadata } from 'next'

import { requireAuth } from '@/lib/auth-helpers-server'
import { DashboardLayout } from '@/components/layout'
import DashboardContent from '@/features/home/dashboard-content'

export const metadata: Metadata = {
  title: 'Dashboard | Noor Academy LMS',
  description: 'Protected dashboard example for Noor Academy LMS.',
}

const DashboardPage = async () => {
  await requireAuth()

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  )
}

export default DashboardPage
