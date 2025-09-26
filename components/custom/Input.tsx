'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Input as PrimitiveInput } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface InputProps extends React.ComponentProps<typeof PrimitiveInput> {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  allowPasswordToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      allowPasswordToggle,
      className,
      endIcon,
      startIcon,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const inputType =
      allowPasswordToggle && type === 'password'
        ? showPassword
          ? 'text'
          : 'password'
        : type

    return (
      <div className="relative flex items-center">
        {startIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
            {startIcon}
          </span>
        ) : null}
        <PrimitiveInput
          ref={ref}
          className={cn(
            startIcon && 'pl-10',
            (allowPasswordToggle || endIcon) && 'pr-10',
            className
          )}
          type={inputType}
          {...props}
        />
        {allowPasswordToggle && type === 'password' ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-foreground"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        ) : endIcon ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
            {endIcon}
          </span>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }
