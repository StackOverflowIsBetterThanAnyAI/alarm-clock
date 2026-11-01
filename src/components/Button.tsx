import { forwardRef } from 'react'

type ButtonProps = {
    autofocus?: boolean
    children: string
    current?: boolean
    disabled?: boolean
    fixedWidth?: boolean
    onClick: () => void
    type?: 'default' | 'primary' | 'danger'
    unfocussable?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            autofocus = false,
            children,
            current,
            disabled = false,
            fixedWidth = false,
            onClick,
            type = 'default',
            unfocussable,
        },
        ref
    ) => {
        const theme = {
            default:
                'bg-surface text-fg border-line enabled:hover:bg-surface-hover',
            primary:
                'bg-accent text-on-accent border-accent enabled:hover:bg-accent-hover',
            danger: 'bg-danger text-on-danger border-danger enabled:hover:bg-danger-hover',
        }
        const isNavItem = current !== undefined
        const variant = current ? 'primary' : type
        return (
            <button
                ref={ref}
                className={`rounded-lg border py-1 font-medium ${
                    isNavItem
                        ? 'flex-1 px-2 whitespace-nowrap'
                        : `${fixedWidth ? 'w-44' : 'min-w-28'} px-3`
                } text-base lg:text-xl sm:text-lg transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed ${theme[variant]}`}
                onClick={onClick}
                autoFocus={autofocus}
                disabled={disabled}
                tabIndex={unfocussable ? -1 : undefined}
                aria-current={current || undefined}
            >
                {children}
            </button>
        )
    }
)

export default Button
