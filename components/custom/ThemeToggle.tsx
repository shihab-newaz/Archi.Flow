'use client'

import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/custom/Button'
import { useTheme } from '@/hooks/use-theme'

const ThemeToggle = () => {
  const { resolvedTheme, toggleTheme, isReady } = useTheme()

  if (!isReady) {
    return null
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  )
}

export { ThemeToggle }
