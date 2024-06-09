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
        <div className="flex flex-col m-auto text-zinc-50">
            <h1 className="m-auto text-2xl lg:text-4xl sm:text-3xl">
                Current Time
            </h1>
            {enabled ? (
                <>
                    <h2 className="m-auto text-xl lg:text-3xl sm:text-2xl">{`${currentTime.hour} : ${currentTime.minute} : ${currentTime.second}`}</h2>
                    {!hideDate && (
                        <h3 className="m-auto text-lg lg:text-2xl sm:text-xl">{`${currentTime.weekDay}, ${currentTime.month} ${currentTime.day} ${currentTime.year}`}</h3>
                    )}
                </>
            ) : (
                <>
                    <h2 className="m-auto text-xl lg:text-3xl sm:text-2xl text-zinc-300">
                        00 : 00 : 00
                    </h2>
                    <h3 className="m-auto text-lg lg:text-2xl sm:text-xl text-zinc-300 italic">
                        Disabled
                    </h3>
                </>
            )}
        </div>
    )
}

export default CurrentTime
