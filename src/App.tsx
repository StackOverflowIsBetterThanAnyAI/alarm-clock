import { createContext, useState } from 'react'
import AlarmButton from './components/AlarmButton'
import CountdownButton from './components/CountdownButton'
import CurrentTime from './components/CurrentTime'
import Toggle from './components/Toggle'
import './index.css'
import CurrentTimeButton from './components/CurrentTimeButton'
import ActivateAlarm from './components/ActivateAlarm'
import { getTwoDigits } from './helper/getTwoDigits'
import { days, months } from './constants/timeConstants'
import { ContextTypeBoolean, ContextTypeCurrentTime } from './types/types'
import Countdown from './components/Countdown'

export const ContextAlarm = createContext<ContextTypeBoolean | undefined>(
    undefined
)
export const ContextCountdown = createContext<ContextTypeBoolean | undefined>(
    undefined
)
export const ContextCurrentTime = createContext<ContextTypeBoolean | undefined>(
    undefined
)
export const ContextTimeEnabled = createContext<ContextTypeBoolean | undefined>(
    undefined
)
export const ContextCurrentTimeState = createContext<
    ContextTypeCurrentTime | undefined
>(undefined)
export const ContextPopupActive = createContext<ContextTypeBoolean | undefined>(
    undefined
)

const App = () => {
    const [alarmActive, setAlarmActive] = useState<boolean>(false)
    const [countdownActive, setCountdownActive] = useState<boolean>(false)
    const [currentTimeActive, setCurrentTimeActive] = useState<boolean>(true)
    const [timeEnabled, setTimeEnabled] = useState<boolean>(true)
    const [popupActive, setPopupActive] = useState<boolean>(false)
    const [currentTime, setCurrentTime] = useState(() => {
        const now = new Date()
        return {
            weekDay: days[now.getDay()],
            month: months[now.getMonth()],
            day: now.getDate(),
            year: now.getFullYear(),
            hour: getTwoDigits(now.getHours()),
            minute: getTwoDigits(now.getMinutes()),
            second: getTwoDigits(now.getSeconds()),
        }
    })

    return (
        <main className="min-w-96 min-h-[26rem] flex flex-col font-sans p-6">
            <ContextAlarm.Provider value={[alarmActive, setAlarmActive]}>
                <ContextCountdown.Provider
                    value={[countdownActive, setCountdownActive]}
                >
                    <ContextTimeEnabled.Provider
                        value={[timeEnabled, setTimeEnabled]}
                    >
                        <ContextCurrentTime.Provider
                            value={[currentTimeActive, setCurrentTimeActive]}
                        >
                            <ContextCurrentTimeState.Provider
                                value={[currentTime, setCurrentTime]}
                            >
                                <ContextPopupActive.Provider
                                    value={[popupActive, setPopupActive]}
                                >
                                    {alarmActive && (
                                        <div className="flex flex-1 flex-col justify-center gap-4">
                                            <CurrentTime
                                                enabled={timeEnabled}
                                                hideDate
                                            />
                                            <ActivateAlarm />
                                        </div>
                                    )}
                                    {countdownActive && (
                                        <div className="flex flex-1 flex-col justify-center gap-4">
                                            <Countdown />
                                        </div>
                                    )}
                                    {currentTimeActive && (
                                        <div className="flex flex-1 flex-col justify-center gap-4">
                                            <Toggle autofocus />
                                            <CurrentTime
                                                enabled={timeEnabled}
                                            />
                                        </div>
                                    )}
                                    <nav
                                        aria-label="Mode"
                                        className="pt-6 flex gap-2"
                                    >
                                        <CurrentTimeButton />
                                        <AlarmButton />
                                        <CountdownButton />
                                    </nav>
                                </ContextPopupActive.Provider>
                            </ContextCurrentTimeState.Provider>
                        </ContextCurrentTime.Provider>
                    </ContextTimeEnabled.Provider>
                </ContextCountdown.Provider>
            </ContextAlarm.Provider>
        </main>
    )
}

export default App
