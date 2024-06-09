import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Button from './Button'
import CountdownPopup from './CountdownPopup'
import Audio from './Audio'
import { getSeconds } from '../helper/getSeconds'
import { ContextPopupActive } from '../App'

const Countdown = () => {
    const contextPopupActive = useContext(ContextPopupActive)
    if (!contextPopupActive) {
        throw new Error(
            'ContextPopupActive must be used within a ContextPopupActive.Provider'
        )
    }

    const [currentSet, setcurrentSet] = useState<number>(5)
    const [currentBreak, setCurrentBreak] = useState<number>(15)
    const [currentCountdownSeconds, setCurrentCountdownSeconds] =
        useState<number>(0)
    const [currentCountdownMinutes, setCurrentCountdownMinutes] =
        useState<number>(1)
    const [currentItem, setCurrentItem] = useState<
        'Countdown' | 'Break' | null
    >(null)
    const [currentTimer, setCurrentTimer] = useState<number | null>(null)
    const [currentSetCounter, setCurrentSetCounter] = useState<number>(1)
    const [preCountdownDisplay, setPreCountdownDisplay] = useState<number>(5)
    const [breakEnabled, setBreakEnabled] = useState(true)
    const [editCountdown, setEditCountdown] = contextPopupActive
    const [countdownActive, setCountdownActive] = useState(false)
    const [preCountDownActive, setPreCountdownActive] = useState(false)
    const [countdownBreakStorage, setCountdownBreakStorage] = useState<
        ({ countdown: number } | { break: number })[] | null
    >(null)

    const popupRef = useRef<HTMLDivElement | null>(null)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const audioRefBeep = useRef<HTMLAudioElement>(null)
    const audioRefBeepLong = useRef<HTMLAudioElement>(null)
    const audioRefPreCountdown = useRef<HTMLAudioElement>(null)
    const isUpdatingRef = useRef<boolean>(false)

    const handleSetup = () => {
        setEditCountdown((prev) => !prev)
    }

    const handleCancel = useCallback(() => {
        setEditCountdown(false)
    }, [setEditCountdown])

    const handleDeactivate = () => {
        setCountdownActive(false)
        setPreCountdownActive(false)
        timerRef.current && clearTimeout(timerRef.current)
        setCountdownBreakStorage(null)
    }

    const handleSetCountdownActive = () => {
        setCountdownActive(true)
        setEditCountdown(false)
        createCountdownBreak()
        setPreCountdownActive(true)
        setPreCountdownDisplay(5)
    }

    const handleSets = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setcurrentSet(parseInt(e.target.value, 10))
    }

    const handleBreakSeconds = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentBreak(parseInt(e.target.value, 10))
    }

    const handleCountdownSeconds = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setCurrentCountdownSeconds(parseInt(e.target.value, 10))
    }

    const handleCountdownMinutes = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setCurrentCountdownMinutes(parseInt(e.target.value, 10))
    }

    const handleBreakEnabled = () => {
        setBreakEnabled((prev) => !prev)
    }

    const startPreCountdown = useCallback(() => {
        audioRefBeep.current?.play()
        timerRef.current = setInterval(() => {
            setPreCountdownDisplay((prev) => {
                if (prev <= 0) {
                    clearInterval(timerRef.current!)
                    timerRef.current = null
                }
                if (prev === 1) {
                    setPreCountdownActive(false)
                    audioRefPreCountdown.current?.play()
                }
                return prev - 1
            })
        }, 1000)
    }, [])

    const updateCountdownBreakStorage = useCallback(
        (item: 'Countdown' | 'Break') => {
            if (isUpdatingRef.current) return
            if (!breakEnabled) setCurrentSetCounter((c) => c + 1)
            if (breakEnabled && item === 'Break') {
                setCurrentSetCounter((c) => c + 1)
            }
            isUpdatingRef.current = true
            setCountdownBreakStorage((prev) => {
                if (prev && prev.length > 1) {
                    return prev.slice(1)
                } else {
                    setCountdownActive(false)
                    return null
                }
            })

            setTimeout(() => {
                isUpdatingRef.current = false
            }, 0)
        },
        [breakEnabled]
    )

    const startTimer = useCallback(
        (item: 'Countdown' | 'Break', seconds: number) => {
            setCurrentTimer(seconds)
            setCurrentItem(item)
            timerRef.current = setInterval(() => {
                setCurrentTimer((prev) => {
                    if (prev !== null && prev <= 1) {
                        clearInterval(timerRef.current!)
                        timerRef.current = null
                        updateCountdownBreakStorage(item)
                    }
                    prev === 1 && audioRefBeepLong.current?.play()
                    return prev! - 1
                })
            }, 1000)
        },
        [updateCountdownBreakStorage]
    )

    useEffect(() => {
        if (countdownActive && preCountdownDisplay > 0) {
            startPreCountdown()
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [countdownActive, preCountdownDisplay, startPreCountdown])

    useEffect(() => {
        if (
            countdownBreakStorage &&
            !preCountDownActive &&
            countdownBreakStorage.length > 0
        ) {
            const nextItem = countdownBreakStorage[0]
            if ('countdown' in nextItem) {
                startTimer('Countdown', nextItem.countdown)
            } else if ('break' in nextItem) {
                startTimer('Break', nextItem.break)
            }
        }
    }, [countdownBreakStorage, preCountDownActive, startTimer])

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
                setEditCountdown(false)
            }
        }

        if (editCountdown) {
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
    }, [editCountdown, handleCancel, setEditCountdown])

    const sets = Array.from({ length: 20 }, (_, i) => i + 1)
    const breakSeconds = Array.from({ length: 12 }, (_, i) => (i + 1) * 5)
    const countdownSeconds = Array.from({ length: 60 }, (_, i) => i)
    const countdownMinutes = Array.from({ length: 31 }, (_, i) => i)
    const setArray = Array.from({ length: currentSet }, (_, i) => i + 1)

    const createCountdownBreak = () => {
        setCurrentSetCounter(1)
        let arr: ({ countdown: number } | { break: number })[] = []
        setArray.map((item) => {
            arr.push({
                countdown: getSeconds(
                    currentCountdownMinutes,
                    currentCountdownSeconds
                ),
            })
            if (breakEnabled && item !== setArray.length) {
                arr.push({ break: currentBreak })
            }
            return arr
        })
        setCountdownBreakStorage(arr)
    }

    return (
        <>
            <h2 className="m-auto text-xl lg:text-3xl sm:text-2xl text-zinc-50">
                Countdown
            </h2>
            <h2 className="m-auto text-lg lg:text-2xl sm:text-xl text-zinc-50">
                with optional Breaks
            </h2>
            {!countdownActive && (
                <div className="min-w-28 m-auto pt-2">
                    <Button
                        onClick={handleSetup}
                        autofocus
                        unfocussable={editCountdown}
                    >
                        Setup
                    </Button>
                </div>
            )}
            {editCountdown && (
                <CountdownPopup
                    breakEnabled={breakEnabled}
                    breakSeconds={breakSeconds}
                    countdownMinutes={countdownMinutes}
                    countdownSeconds={countdownSeconds}
                    currentBreak={currentBreak}
                    currentCountdownSeconds={currentCountdownSeconds}
                    currentCountdownMinutes={currentCountdownMinutes}
                    currentSet={currentSet}
                    handleBreakEnabled={handleBreakEnabled}
                    handleBreakSeconds={handleBreakSeconds}
                    handleCancel={handleCancel}
                    handleCountdownSeconds={handleCountdownSeconds}
                    handleCountdownMinutes={handleCountdownMinutes}
                    handleSetCountdownActive={handleSetCountdownActive}
                    handleSets={handleSets}
                    popupRef={popupRef}
                    sets={sets}
                />
            )}
            {countdownActive && (
                <>
                    <div className="flex flex-col min-w-64 m-auto mt-2 px-2 text-base lg:text-xl sm:text-lg outline outline-2 outline-green-600 text-zinc-50 bg-blue-800">
                        {preCountdownDisplay > 0 ? (
                            <>
                                <h2 className="m-auto text-xl lg:text-3xl sm:text-2xl pt-2">
                                    {preCountdownDisplay}
                                </h2>
                                <h3 className="m-auto text-lg lg:text-2xl sm:text-xl pb-2">
                                    Get ready!
                                </h3>
                            </>
                        ) : (
                            <>
                                <>
                                    {currentTimer !== null && (
                                        <>
                                            {currentSet > 1 && (
                                                <h2 className="m-auto text-xl lg:text-3xl sm:text-2xl pt-2">
                                                    Current Set:{' '}
                                                    {currentSetCounter}
                                                </h2>
                                            )}
                                            <h3 className="m-auto text-lg lg:text-2xl sm:text-xl">
                                                {currentItem}: {currentTimer}s
                                            </h3>
                                        </>
                                    )}
                                </>
                            </>
                        )}
                        <div className="m-auto p-2">
                            <Button type="red" onClick={handleDeactivate}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                    <h4 className="text-base lg:text-xl sm:text-lg m-auto pt-2 text-zinc-50">
                        Please keep the window open!
                    </h4>
                </>
            )}
            <Audio
                audioRef={audioRefPreCountdown}
                src="/audio/preCountdown.mp3"
                loop={false}
            />
            <Audio
                audioRef={audioRefBeepLong}
                src="/audio/beepLong.mp3"
                loop={false}
            />
            <Audio audioRef={audioRefBeep} src="/audio/beep.mp3" loop={false} />
        </>
    )
}

export default Countdown
