// ============================================================================
// BUTTON COMPONENT TYPES
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonColor = 'cyan' | 'pink' | 'emerald'
export type GlowIntensity = 'none' | 'subtle' | 'strong'

/**
 * Note: This uses composition pattern, so content (label, icon, etc.) 
 * is passed as children, not props.
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
    children?: React.ReactNode
    variant?: ButtonVariant
    size?: ButtonSize
    color?: ButtonColor

    // State props
    isLoading?: boolean
    isError?: boolean
    isSuccess?: boolean

    // Event handlers
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
    debounceMs?: number
    throttleMs?: number
    disableOnClick?: boolean

    // Visual customization
    textColor?: string
    bgColor?: string
    glowIntensity?: GlowIntensity
}