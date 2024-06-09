import { FC } from 'react'

type ButtonProps = {
    autofocus?: boolean
    children: string
    disabled?: boolean
    onClick: () => void
    unfocussable?: boolean
    type?: 'default' | 'green' | 'red'
}

const Button: FC<ButtonProps> = ({
    autofocus = false,
    children,
    disabled = false,
    onClick,
    unfocussable,
    type = 'default',
}) => {
    const theme = {
        default: `${disabled ? 'bg-blue-600/75' : 'bg-blue-600'} ${
            !disabled && 'hover:bg-blue-700 active:bg-blue-800'
        }`,
        green: `${disabled ? 'bg-green-600/75' : 'bg-green-600'} ${
            !disabled && 'hover:bg-green-700 active:bg-green-800'
        }`,
        red: `${disabled ? 'bg-red-600/75' : 'bg-red-600'} ${
            !disabled && 'hover:bg-red-700 active:bg-red-800'
        }`,
    }
    const className = theme[type]
    return (
        <button
            className={`rounded-md px-2 min-w-28 text-zinc-50 outline outline-1 ${
                disabled ? 'outline-zinc-400' : 'outline-zinc-50'
            } text-base lg:text-xl sm:text-lg
        focus:outline-4 focus:font-medium ${className}
        ${disabled && 'cursor-not-allowed'}`}
            onClick={onClick}
            autoFocus={autofocus}
            disabled={disabled}
            tabIndex={unfocussable ? -1 : undefined}
        >
            {children}
        </button>
    )
}

export default Button
