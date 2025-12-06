'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ArchitectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string
    color?: 'cyan' | 'pink'
    icon?: React.ReactNode
    shortcut?: string
}

const ArchitectButton = React.forwardRef<HTMLButtonElement, ArchitectButtonProps>(
    ({ label, onClick, color = 'cyan', icon, shortcut, className, ...props }, ref) => {

        // Architect Color Map
        const colorStyles = {
            cyan: {
                border: 'group-hover:border-cyan-600/50',
                text: 'group-hover:text-cyan-600',
                bg: 'bg-cyan-600',
                corner: 'bg-cyan-600',
            },
            pink: {
                border: 'group-hover:border-pink-600/50',
                text: 'group-hover:text-pink-600',
                bg: 'bg-pink-600',
                corner: 'bg-pink-600',
            },
        }

        const activeColor = colorStyles[color]

        return (
            <button
                ref={ref}
                onClick={onClick}
                className={cn(
                    'group relative inline-flex h-12 min-w-[160px] items-center justify-center overflow-hidden bg-transparent px-6 font-mono text-sm uppercase tracking-widest transition-all duration-300 focus:outline-none',
                    className
                )}
                {...props}
            >
                {/* STRUCTURAL BORDER (Static) */}
                <div className="absolute inset-0 border border-border transition-colors duration-300 group-hover:border-transparent" />

                {/* ACTIVE BORDER (Animated reveal) */}
                <div className={cn(
                    "absolute inset-0 border border-transparent transition-colors duration-300",
                    activeColor.border
                )} />

                {/* BACKGROUND FILL (Slide Up) */}
                <div className={cn(
                    "absolute inset-0 translate-y-full opacity-10 transition-transform duration-300 ease-out group-hover:translate-y-0",
                    activeColor.bg
                )} />

                {/* CORNER MARKERS (Technical Aesthetics) */}
                {/* Top Left */}
                <span className={cn(
                    "absolute left-0 top-0 h-[1px] w-[1px] transition-all duration-300 group-hover:h-2 group-hover:w-2",
                    activeColor.corner
                )} />
                {/* Bottom Right */}
                <span className={cn(
                    "absolute bottom-0 right-0 h-[1px] w-[1px] transition-all duration-300 group-hover:h-2 group-hover:w-2",
                    activeColor.corner
                )} />

                {/* LABEL & ICON */}
                <div className="relative z-10 flex items-center gap-2 text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                    {icon && <span className="text-lg">{icon}</span>}
                    <span className="font-semibold">{label}</span>
                </div>

                {/* SHORTCUT INDICATOR */}
                {shortcut && (
                    <div className="absolute bottom-1 right-2 text-[10px] text-muted-foreground/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {shortcut}
                    </div>
                )}
            </button>
        )
    }
)

ArchitectButton.displayName = 'ArchitectButton'

export default ArchitectButton
