'use client'

import React, { useState, useRef } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  color?: 'cyan' | 'pink'
  icon?: React.ReactNode
  shortcut?: string
}

export default React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { label, onClick, color = 'cyan', icon, shortcut, className = '', ...props },
  ref
) {
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger parent click
    if (onClick) onClick(e)

    // Trigger visual shimmer
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsAnimating(false)

    // Small delay to allow react to reset the class if clicked rapidly
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true)
      })
    })

    // Auto cleanup
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  return (
    <button
      ref={ref}
      className={`${styles.button} ${styles[color]} group ${className}`}
      onClick={handleClick}
      aria-label={label}
      {...props}
    >
      {/* LAYER 1: The Base (Housing) */}
      <div className={styles.base}></div>

      {/* LAYER 2: The Cap (Moving Part) */}
      <div className={styles.cap}>
        {/* Decor: Corner markers */}
        <span className={`${styles.cornerMarker} ${styles.topLeft}`}></span>
        <span className={`${styles.cornerMarker} ${styles.topRight}`}></span>
        <span className={`${styles.cornerMarker} ${styles.bottomLeft}`}></span>
        <span className={`${styles.cornerMarker} ${styles.bottomRight}`}></span>

        {/* Content */}
        <span
          className={`relative z-10 flex items-center gap-3 transition-colors duration-300 ${color === 'cyan' ? 'group-hover:text-cyan-400' : 'group-hover:text-pink-400'}`}
        >
          {icon}
          {label}
        </span>

        {/* Shortcut Hint */}
        {shortcut && <span className={styles.shortcutBadge}>{shortcut}</span>}

        {/* LAYER 3: The Glint (Animation Overlay) */}
        <div
          className={`${styles.shimmerLayer} ${isAnimating ? styles.animateGlint : ''}`}
        ></div>
      </div>
    </button>
  )
})
