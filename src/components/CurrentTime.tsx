import { FC, useCallback, useContext, useEffect } from 'react'
import { getTwoDigits } from '../helper/getTwoDigits'
import { days, months } from '../constants/timeConstants'
import { ContextCurrentTimeState } from '../App'

type CurrentTimeProps = {
    enabled: boolean
    hideDate?: boolean
}
const CurrentTime: FC<CurrentTimeProps> = ({ enabled, hideDate = false }) => {
    const contextCurrenTimeState = useContext(ContextCurrentTimeState)
    if (!contextCurrenTimeState) {
        throw new Error(
            'ContextCurrenTimeState must be used within a ContextCurrenTimeState.Provider'
        )
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentTime, setCurrentTime] = contextCurrenTimeState

    const updateDate = useCallback(() => {
        const newDate = new Date()
        setCurrentTime({
            weekDay: days[newDate.getDay()],
            month: months[newDate.getMonth()],
            day: newDate.getDate(),
            year: newDate.getFullYear(),
            hour: getTwoDigits(newDate.getHours()),
            minute: getTwoDigits(newDate.getMinutes()),
            second: getTwoDigits(newDate.getSeconds()),
        })
    }, [setCurrentTime])

    useEffect(() => {
        if (enabled) {
            updateDate()
            const timer = setInterval(() => updateDate(), 1000)
            return () => clearInterval(timer)
        }
    }, [enabled, updateDate])

    return (
        <div className="flex flex-col mx-auto items-center">
            <h1 className="mx-auto text-base lg:text-xl sm:text-lg font-medium uppercase tracking-widest text-fg-muted">
                Current Time
            </h1>
            {enabled ? (
                <>
                    <p className="mx-auto text-4xl lg:text-6xl sm:text-5xl font-mono font-semibold">{`${currentTime.hour}:${currentTime.minute}:${currentTime.second}`}</p>
                    {!hideDate && (
                        <p className="mx-auto text-base lg:text-xl sm:text-lg text-fg-muted">{`${currentTime.weekDay}, ${currentTime.month} ${currentTime.day} ${currentTime.year}`}</p>
                    )}
                </>
            ) : (
                <>
                    <p className="mx-auto text-4xl lg:text-6xl sm:text-5xl font-mono font-semibold text-fg-muted">
                        00:00:00
                    </p>
                    <p className="mx-auto text-base lg:text-xl sm:text-lg text-fg-muted italic">
                        Disabled
                    </p>
                </>
            )}
        </div>
    )
}

export default CurrentTime
