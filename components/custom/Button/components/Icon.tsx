/**
 * Wraps an icon (e.g., from lucide-react) with proper sizing and spacing.
 * Automatically fades out when the button is in loading state.
 */

'use client'

import React from 'react'
import { useButtonContext } from '../context/ButtonContext'

interface ButtonIconProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode
}

export function ButtonIcon({ children, className = '', ...props }: ButtonIconProps) {
    const { isLoading } = useButtonContext()

    return (
        <span
            className={`flex items-center justify-center transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
            {...props}
        >
            {children}
        </span>
    )
}
