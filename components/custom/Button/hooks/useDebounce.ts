/**
 * Delays function execution until the user stops triggering it.
 * Useful for search inputs, resize handlers, etc.
 */

import { useRef, useCallback, useEffect } from 'react'

export function useDebounce<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const debouncedFn = useCallback((...args: Parameters<T>) => {
        // Clear previous timeout
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        // Set new timeout
        timeoutRef.current = setTimeout(() => callback(...args), delay)
    }, [callback, delay]) as T

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    return debouncedFn
}
