import { createContext, useContext } from 'react'
import { ButtonVariant, ButtonSize, ButtonColor, GlowIntensity } from '../types'

/**
 * Values shared via context to all Button child components
 */
export interface ButtonContextValue {
    variant: ButtonVariant
    size: ButtonSize
    color: ButtonColor
    glowIntensity: GlowIntensity
    disabled: boolean
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
}

export const ButtonContext = createContext<ButtonContextValue | null>(null)

/**
 * Hook to access button context from child components.
 * 
 * @throws Error if used outside of Button component
 */
export function useButtonContext() {
    const context = useContext(ButtonContext)
    if (!context) {
        throw new Error('Button compound components must be used within Button.Root')
    }
    return context
}
