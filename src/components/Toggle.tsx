import { FC, useContext } from 'react'
import { ContextTimeEnabled } from '../App'

type ToggleProps = {
    autofocus?: boolean
    disabled?: boolean
}

const Toggle: FC<ToggleProps> = ({ autofocus = false, disabled = false }) => {
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
            className={`flex m-auto mb-4 outline outline-2 text-base lg:text-xl sm:text-lg ${
                !disabled
                    ? timeEnabled
                        ? 'outline-green-600'
                        : 'outline-red-600'
                    : 'outline-zinc-400'
            } rounded-xl mb-2
            focus:outline-zinc-50 focus:font-medium focus:outline-4
            ${disabled && 'cursor-not-allowed'}`}
            onClick={handleClick}
            disabled={disabled}
            aria-disabled={disabled}
            autoFocus={autofocus}
        >
            <div
                className={`px-2 py-1 rounded-l-xl ${
                    timeEnabled
                        ? `text-zinc-50 ${
                              disabled
                                  ? 'bg-green-600/75'
                                  : 'hover:bg-green-700 active:bg-green-800 bg-green-600'
                          }`
                        : 'text-zinc-200 bg-zinc-500'
                }`}
            >
                Enabled
            </div>
            <div
                className={`px-2 py-1 rounded-r-xl ${
                    timeEnabled
                        ? 'text-zinc-200 bg-zinc-500'
                        : `text-zinc-50 bg-red-600 ${
                              !disabled && 'hover:bg-red-700 active:bg-red-800'
                          }`
                }`}
            >
                Disabled
            </div>
        </button>
    )
}

export default Toggle
