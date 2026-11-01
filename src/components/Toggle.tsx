import { FC, useContext } from 'react'
import { ContextTimeEnabled } from '../App'

type ToggleProps = {
    autofocus?: boolean
}

const Toggle: FC<ToggleProps> = ({ autofocus = false }) => {
    const context = useContext(ContextTimeEnabled)
    if (!context) {
        throw new Error(
            'ContextTimeEnabled must be used within a ContextTimeEnabled.Provider'
        )
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [timeEnabled, setTimeEnabled] = context
    const handleClick = () => setTimeEnabled((prev) => !prev)

    return (
        <button
            className="flex mx-auto rounded-full border border-line bg-surface p-1 text-base lg:text-xl sm:text-lg"
            role="switch"
            aria-checked={timeEnabled}
            aria-label="Show current time"
            onClick={handleClick}
            autoFocus={autofocus}
        >
            <span
                aria-hidden="true"
                className={`rounded-full px-3 py-0.5 transition-colors ${
                    timeEnabled ? 'bg-accent text-on-accent' : 'text-fg-muted'
                }`}
            >
                Enabled
            </span>
            <span
                aria-hidden="true"
                className={`rounded-full px-3 py-0.5 transition-colors ${
                    timeEnabled ? 'text-fg-muted' : 'bg-accent text-on-accent'
                }`}
            >
                Disabled
            </span>
        </button>
    )
}

export default Toggle
