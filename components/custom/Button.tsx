'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'

import { Button as PrimitiveButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ComponentProps<typeof PrimitiveButton> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, disabled, isLoading, leftIcon, rightIcon, ...props },
    ref
  ) => {
    return (
      <PrimitiveButton
        ref={ref}
        className={cn('gap-2', className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {rightIcon}
      </PrimitiveButton>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
