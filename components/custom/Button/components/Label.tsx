/**
 * Displays the button's text label. Automatically fades out when the button
 * is in loading state (via context).
 */

'use client'

import React from 'react'
import { useButtonContext } from '../context/ButtonContext'

interface ButtonLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode
}

export function ButtonLabel({ children, className = '', ...props }: ButtonLabelProps) {
    const { isLoading } = useButtonContext()

    return (
        <span
            className={`font-bold tracking-widest transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
            {...props}
        >
            {children}
        </span>
    )
}
