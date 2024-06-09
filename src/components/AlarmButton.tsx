import { useContext } from 'react'
import Button from './Button'
import {
    ContextAlarm,
    ContextCountdown,
    ContextCurrentTime,
    ContextPopupActive,
    ContextTimeEnabled,
} from '../App'

const AlarmButton = () => {
    const contextPopupActive = useContext(ContextPopupActive)
    if (!contextPopupActive) {
        throw new Error(
            'ContextPopupActive must be used within a ContextPopupActive.Provider'
        )
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [popupActive, setPopupActive] = contextPopupActive

    const contextAlarm = useContext(ContextAlarm)
    if (!contextAlarm) {
        throw new Error(
            'ContextAlarm must be used within a ContextAlarm.Provider'
        )
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [alarmActive, setAlarmActive] = contextAlarm

    const contextCountdown = useContext(ContextCountdown)
    if (!contextCountdown) {
        throw new Error(
            'ContextCountdown must be used within a ContextCountdown.Provider'
        )
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [countdownActive, setCountdownActive] = contextCountdown

    const contextCurrentTime = useContext(ContextCurrentTime)
    if (!contextCurrentTime) {
        throw new Error(
            'ContextCurrentTime must be used within a ContextCurrentTime.Provider'
        )
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentTimeActive, setCurrentTimeActive] = contextCurrentTime

    const context = useContext(ContextTimeEnabled)
    if (!context) {
        throw new Error(
            'ContextTimeEnabled must be used within a ContextTimeEnabled.Provider'
        )
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [timeEnabled, setTimeEnabled] = context

    const handleClick = () => {
        setAlarmActive(true)
        setCurrentTimeActive(false)
        setCountdownActive(false)
        setTimeEnabled(true)
    }

    return (
        <Button onClick={handleClick} unfocussable={popupActive}>
            Alarm
        </Button>
    )
}

export default AlarmButton
