import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/custom/Button'
import { requireAuth } from '@/lib/auth-helpers-server'
import { DashboardHero } from '@/modules/dashboard/DashboardHero'

export const metadata: Metadata = {
  title: 'Dashboard | Noor Academy LMS',
  description: 'Protected dashboard example for Noor Academy LMS.',
}

const DashboardPage = async () => {
  await requireAuth()

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-8 px-4 py-16">
      <header className="space-y-3 text-center">
        <h1 className="text-3xl font-semibold text-foreground">
          You&apos;re authenticated 🎉
        </h1>
        <p className="text-sm text-muted-foreground">
          This protected route demonstrates how to guard pages in the App
          Router. Replace this section with your own dashboard modules, charts,
          and reports.
        </p>
      </header>

      <DashboardHero />

      <div className="flex justify-center">
        <Button asChild>
          <Link href="/">Back to marketing site</Link>
        </Button>
      </div>
    </section>
  )
}

export default DashboardPage
