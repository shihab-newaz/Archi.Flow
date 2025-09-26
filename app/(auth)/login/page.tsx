import type { Metadata } from 'next'
import Link from 'next/link'
import { Github, ShieldCheck, UserPlus } from 'lucide-react'

import { AuthShell } from '@/components/custom/AuthShell'
import { Button } from '@/components/custom/Button'
import { ThemeToggle } from '@/components/custom/ThemeToggle'
import { LoginForm } from '@/modules/auth/components/LoginForm'

export const metadata: Metadata = {
  title: 'Sign in | Noor Academy LMS',
  description:
    'Access your Noor Academy dashboard and manage your learning journey.',
}

const LoginPage = () => {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to access your personalized learning experience."
      footer={
        <div className="flex flex-col items-center gap-2">
          <p>
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            Secure API-first authentication
          </div>
        </div>
      }
      illustration={
        <div className="space-y-6 text-primary dark:text-primary-foreground">
          <h2 className="text-3xl font-semibold leading-tight lg:text-4xl">
            Build trust with seamless access
          </h2>
          <p className="text-base text-muted-foreground dark:text-muted">
            Single sign-on, compliant backups, and reliable monitoring keep your
            institution running smoothly.
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
            leftIcon={<Github className="h-4 w-4" aria-hidden />}
          >
            Sign in with GitHub
          </Button>
          <Button
            variant="outline"
            leftIcon={<UserPlus className="h-4 w-4" aria-hidden />}
          >
            Continue with SSO
          </Button>
        </div>

        <div className="text-center text-xs uppercase tracking-wide text-muted-foreground">
          or continue with email
        </div>

        <LoginForm />
      </div>
    </AuthShell>
  )
}

export default LoginPage
