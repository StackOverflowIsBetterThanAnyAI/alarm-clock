import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Button from './Button'
import { getTwoDigits } from '../helper/getTwoDigits'
import { ContextCurrentTimeState, ContextPopupActive } from '../App'
import { getTimeFormat } from '../helper/getTimeFormat'
import AlarmPopup from './AlarmPopup'
import Audio from './Audio'

const ActivateAlarm = () => {
    const contextPopupActive = useContext(ContextPopupActive)
    if (!contextPopupActive) {
        throw new Error(
            'ContextPopupActive must be used within a ContextPopupActive.Provider'
        )
    }

    const contextCurrenTimeState = useContext(ContextCurrentTimeState)
    if (!contextCurrenTimeState) {
        throw new Error(
            'ContextCurrenTimeState must be used within a ContextCurrenTimeState.Provider'
        )
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [currentTime, setCurrentTime] = contextCurrenTimeState

    const [editAlarm, setEditAlarm] = contextPopupActive
    const [ringsIn, setRingsIn] = useState({ minutes: 5, seconds: 0 })
    const [alarmActive, setAlarmActive] = useState(false)
    const [alarmTime, setAlarmTime] = useState<string>('')
    const [estimatedAlarmTime, setEstimatedAlarmTime] = useState<string>('')
    const [audioPlaying, setAudioPlaying] = useState(false)

    const popupRef = useRef<HTMLDivElement | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const buttonRef = useRef<HTMLButtonElement | null>(null)

    const handleClick = () => {
        setEditAlarm((prev) => !prev)
    }

    const handleMinutesChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newMinutes = parseInt(event.target.value, 10)
        setRingsIn((prevState) => ({
            ...prevState,
            minutes: newMinutes,
        }))
    }

    const handleSecondsChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newSeconds = parseInt(event.target.value, 10)
        setRingsIn((prevState) => ({
            ...prevState,
            seconds: newSeconds,
        }))
    }

    const handleCancel = useCallback(() => {
        setEditAlarm(false)
        buttonRef.current?.focus()
    }, [setEditAlarm])

    const handleSetAlarmActive = () => {
        setEditAlarm(false)
        setAlarmActive(true)
        setAlarmTime(estimatedAlarmTimeDisplay)
        setEstimatedAlarmTime(
            getTimeFormat(
                `${getTwoDigits(currentTime.hour.toString())} : ${getTwoDigits(
                    parseInt(currentTime.minute.toString()) + ringsIn.minutes
                )} : ${getTwoDigits(
                    parseInt(currentTime.second.toString()) + ringsIn.seconds
                )}`
            )
        )
    }

    const handleDeactivateAlarm = () => {
        setAlarmActive(false)
        setAlarmTime('')
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                handleCancel()
            }
        }

        if (editAlarm) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [editAlarm, handleCancel])

    const minutes = Array.from({ length: 60 }, (_, i) => i)
    const seconds = Array.from({ length: 60 }, (_, i) => i)

    const estimatedAlarmTimeDisplay = getTimeFormat(
        `${getTwoDigits(currentTime.hour.toString())} : ${getTwoDigits(
            parseInt(currentTime.minute.toString()) + ringsIn.minutes
        )} : ${getTwoDigits(
            parseInt(currentTime.second.toString()) + ringsIn.seconds
        )}`
    )

    const time = `${currentTime.hour} : ${currentTime.minute} : ${currentTime.second}`

    useEffect(() => {
        const stopAudio = () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
                handleDeactivateAlarm()
                setAudioPlaying(false)
            }
        }

        const startAudio = () => {
            if (audioRef.current) {
                audioRef.current.currentTime = 0
                audioRef.current.play()
                setAudioPlaying(true)
            }
        }

        const playAudio = () => {
            if (alarmActive && estimatedAlarmTime === time) {
                startAudio()
            }
            if (!alarmActive && audioPlaying) {
                stopAudio()
            }
        }

        playAudio()
    }, [audioPlaying, alarmActive, estimatedAlarmTime, time])

    return (
        <>
            {!alarmActive && (
                <div className="mx-auto">
                    <Button
                        onClick={handleClick}
                        autofocus
                        fixedWidth
                        unfocussable={editAlarm}
                        ref={buttonRef}
                    >
                        Activate Alarm
                    </Button>
                </div>
            )}
            {editAlarm && (
                <AlarmPopup
                    estimatedAlarmTime={estimatedAlarmTimeDisplay}
                    handleCancel={handleCancel}
                    handleMinutesChange={handleMinutesChange}
                    handleSecondsChange={handleSecondsChange}
                    handleSetAlarmActive={handleSetAlarmActive}
                    minutes={minutes}
                    popupRef={popupRef}
                    ringsIn={ringsIn}
                    seconds={seconds}
                />
            )}
            {alarmActive && (
                <>
                    <div
                        className={`flex flex-col w-full max-w-xs mx-auto px-4 py-3 rounded-xl border bg-surface text-base lg:text-xl sm:text-lg ${
                            audioPlaying
                                ? 'border-accent motion-safe:animate-pulse-fast'
                                : 'border-line'
                        }`}
                    >
                        <h2
                            className="text-base lg:text-xl sm:text-lg mx-auto text-fg-muted"
                            aria-live="assertive"
                        >
                            {`Alarm${
                                audioPlaying ? '!' : ' will be ringing at:'
                            }`}
                        </h2>
                        <p className="mx-auto text-3xl lg:text-5xl sm:text-4xl font-mono font-semibold">
                            {alarmTime.replaceAll(' ', '')}
                        </p>
                        <div className="mx-auto p-2">
                            <Button
                                type="danger"
                                onClick={handleDeactivateAlarm}
                                autofocus
                            >
                                Deactivate
                            </Button>
                        </div>
                    </div>
                    <p className="text-base lg:text-xl sm:text-lg mx-auto text-fg-muted">
                        Please keep the window open!
                    </p>
                </>
            )}
            <Audio audioRef={audioRef} src="./audio/alarm.mp3" loop />
        </>
    )
}

export default ActivateAlarm
