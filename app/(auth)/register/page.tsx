import type { Metadata } from 'next'
import Link from 'next/link'
import { BadgeCheck, BellRing } from 'lucide-react'

import { AuthShell } from '@/components/custom/AuthShell'
import { Button } from '@/components/custom/Button'
import { ThemeToggle } from '@/components/custom/ThemeToggle'
import { RegisterForm } from '@/modules/auth/components/RegisterForm'

export const metadata: Metadata = {
  title: 'Create account | Noor Academy LMS',
  description:
    'Set up your Noor Academy account and start managing your institution.',
}

const RegisterPage = () => {
  return (
    <AuthShell
      title="Create your account"
      description="Set up your school or madrasa in minutes and invite your team."
      footer={
        <div className="flex flex-col items-center gap-2">
          <p>
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in instead
            </Link>
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BadgeCheck className="h-4 w-4" />
            14-day audit logs • Granular permissions
          </div>
        </div>
      }
      illustration={
        <div className="space-y-6 text-primary dark:text-primary-foreground">
          <h2 className="text-3xl font-semibold leading-tight lg:text-4xl">
            Onboard students and staff effortlessly
          </h2>
          <p className="text-base text-muted-foreground dark:text-muted">
            Automate communication, track progress, and deliver personalised
            learning journeys.
          </p>
        </div>
      }
    >
      <div className="flex items-center justify-end">
        <ThemeToggle />
      </div>

      <div className="grid gap-4">
        <div className="grid gap-3">
          <Button
            variant="outline"
            leftIcon={<BellRing className="h-4 w-4" aria-hidden />}
          >
            Invite teammates
          </Button>
        </div>

        <RegisterForm />
      </div>
    </AuthShell>
  )
}

export default RegisterPage
