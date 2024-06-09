import { FC } from 'react'

type SelectProps = {
    autofocus?: boolean
    id: string
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
    options: number[]
    value: number
}

const Select: FC<SelectProps> = ({
    autofocus,
    id,
    onChange,
    options,
    value,
}) => {
    return (
        <>
            <label htmlFor={id} className="text-base lg:text-xl sm:text-lg">
                {id.substring(0, 1).toUpperCase()}
                {id.substring(1)}:
            </label>
            <select
                name={id}
                id={id}
                onChange={onChange}
                value={value}
                className="bg-zinc-700 p-1 rounded-md outline outline-1 outline-zinc-50 min-w-14 text-base lg:text-xl sm:text-lg
                focus:outline-4
                hover:bg-zinc-500
                active:bg-zinc-600"
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
