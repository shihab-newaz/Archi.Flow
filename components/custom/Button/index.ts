import { ButtonRoot } from './components/Root'
import { ButtonLabel } from './components/Label'
import { ButtonIcon } from './components/Icon'
import { ButtonShortcut } from './components/Shortcut'
import { ButtonSpinner } from './components/Spinner'

export type { ButtonProps } from './types'

/**
 * The main Button export using Object.assign to create a compound component.
 * This allows dot notation (Button.Label, Button.Icon, etc.) while keeping
 * the root component callable as <Button>.
 */
export const Button = Object.assign(ButtonRoot, {
    Label: ButtonLabel,
    Icon: ButtonIcon,
    Shortcut: ButtonShortcut,
    Spinner: ButtonSpinner,
})