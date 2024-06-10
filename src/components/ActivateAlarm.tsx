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

        const handleEscape = (event: KeyboardEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node) &&
                event.key === 'Escape'
            ) {
                setEditAlarm(false)
            }
        }

        if (editAlarm) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleEscape)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [editAlarm, handleCancel, setEditAlarm])

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
                <div className="min-w-28 m-auto pt-2">
                    <Button
                        onClick={handleClick}
                        autofocus
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
                        className={`flex flex-col min-w-64 m-auto mt-2 px-2 text-base lg:text-xl sm:text-lg outline outline-2 outline-green-600 text-zinc-50 bg-blue-800 ${
                            audioPlaying && 'animate-pulse-fast'
                        }`}
                    >
                        <h3 className="text-lg lg:text-2xl sm:text-xl m-auto">
                            {`Alarm${
                                audioPlaying ? '!' : ' will be ringing at:'
                            }`}
                        </h3>
                        <h2 className="m-auto text-xl lg:text-3xl sm:text-2xl">
                            {alarmTime}
                        </h2>
                        <div className="m-auto p-2">
                            <Button
                                type="red"
                                onClick={handleDeactivateAlarm}
                                autofocus
                            >
                                Deactivate
                            </Button>
                        </div>
                    </div>
                    <h4 className="text-base lg:text-xl sm:text-lg m-auto pt-2 text-zinc-50">
                        Please keep the window open!
                    </h4>
                </>
            )}
            <Audio audioRef={audioRef} src="/audio/alarm.mp3" loop />
        </>
    )
}

export default ActivateAlarm
