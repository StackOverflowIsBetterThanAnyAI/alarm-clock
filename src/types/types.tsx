import { Dispatch, SetStateAction } from 'react'

export type ContextTypeBoolean = [boolean, Dispatch<SetStateAction<boolean>>]
export type CurrentTimeType = {
    weekDay: string
    month: string
    day: number
    year: number
    hour: string | number
    minute: string | number
    second: string | number
}
export type ContextTypeCurrentTime = [
    CurrentTimeType,
    Dispatch<SetStateAction<CurrentTimeType>>
]
