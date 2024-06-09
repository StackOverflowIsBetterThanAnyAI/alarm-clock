import { useContext } from 'react'
import Button from './Button'
import {
    ContextAlarm,
    ContextCountdown,
    ContextCurrentTime,
    ContextPopupActive,
} from '../App'

const CurrentTimeButton = () => {
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

    const handleClick = () => {
        setAlarmActive(false)
        setCurrentTimeActive(true)
        setCountdownActive(false)
    }

    return (
        <Button onClick={handleClick} unfocussable={popupActive}>
            Current Time
        </Button>
    )
}

export default CurrentTimeButton
