/**
 * Limits function execution frequency. Ensures the function runs at most
 * once per specified delay, even if triggered multiple times.
 */

import { useRef, useCallback, useEffect } from 'react'
export function useThrottle<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T {
    const lastCall = useRef<number>(0)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const throttledFn = useCallback((...args: Parameters<T>) => {
        const now = Date.now()
        const remaining = delay - (now - lastCall.current)

        if (remaining <= 0) {
            // Enough time has passed, execute immediately
            lastCall.current = now
            callback(...args)
        } else if (!timeoutRef.current) {
            // Schedule execution for when the delay period ends
            timeoutRef.current = setTimeout(() => {
                lastCall.current = Date.now()
                timeoutRef.current = null
                callback(...args)
            }, remaining)
        }
    }, [callback, delay]) as T

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    return throttledFn
}
