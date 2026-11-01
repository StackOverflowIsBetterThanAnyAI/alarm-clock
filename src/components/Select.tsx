import { FC } from 'react'

type SelectProps = {
    autofocus?: boolean
    label: string
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
    options: number[]
    value: number
}

const Select: FC<SelectProps> = ({
    autofocus,
    label,
    onChange,
    options,
    value,
}) => {
    const id = label.toLowerCase().replaceAll(' ', '-')

    return (
        <>
            <label htmlFor={id} className="text-base lg:text-xl sm:text-lg">
                {label}:
            </label>
            <select
                name={id}
                id={id}
                onChange={onChange}
                value={value}
                className="bg-surface text-fg px-2 py-1 rounded-lg border border-line min-w-16 min-h-8 font-mono text-base lg:text-xl sm:text-lg
                hover:bg-surface-hover"
                autoFocus={autofocus}
            >
                {options.map((o) => (
                    <option value={o} key={o}>
                        {o}
                    </option>
                ))}
            </select>
        </>
    )
}

export default Select
