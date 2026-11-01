import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Button from './Button'
import CountdownPopup from './CountdownPopup'
import Audio from './Audio'
import { getSeconds } from '../helper/getSeconds'
import { getTwoDigits } from '../helper/getTwoDigits'
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
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const audioRefBeep = useRef<HTMLAudioElement | null>(null)
    const audioRefBeepLong = useRef<HTMLAudioElement | null>(null)
    const audioRefPreCountdown = useRef<HTMLAudioElement | null>(null)
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    const isUpdatingRef = useRef<boolean>(false)

    const handleSetup = () => {
        setEditCountdown((prev) => !prev)
    }

    const handleCancel = useCallback(() => {
        setEditCountdown(false)
        buttonRef.current?.focus()
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

        if (editCountdown) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [editCountdown, handleCancel])

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
            <div className="flex flex-col items-center gap-1">
                <h1 className="text-2xl lg:text-4xl sm:text-3xl font-semibold tracking-tight">
                    Countdown
                </h1>
                <p className="text-base lg:text-xl sm:text-lg text-fg-muted">
                    with optional Breaks
                </p>
            </div>
            {!countdownActive && (
                <div className="mx-auto">
                    <Button
                        onClick={handleSetup}
                        autofocus
                        fixedWidth
                        unfocussable={editCountdown}
                        ref={buttonRef}
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
                    <div className="flex flex-col w-full max-w-xs mx-auto px-4 py-3 rounded-xl border bg-surface text-base lg:text-xl sm:text-lg border-line">
                        <p className="sr-only" aria-live="polite">
                            {preCountdownDisplay > 0
                                ? 'Get ready!'
                                : currentItem &&
                                  `${currentItem}${
                                      currentSet > 1
                                          ? `, set ${currentSetCounter} of ${currentSet}`
                                          : ''
                                  }`}
                        </p>
                        <div
                            role="timer"
                            className="flex flex-col justify-center min-h-24"
                        >
                            {preCountdownDisplay > 0 ? (
                                <>
                                    <p className="mx-auto text-base lg:text-xl sm:text-lg text-fg-muted">
                                        Get ready!
                                    </p>
                                    <p className="mx-auto text-3xl lg:text-5xl sm:text-4xl font-mono font-semibold">
                                        {preCountdownDisplay}
                                    </p>
                                </>
                            ) : (
                                currentTimer !== null && (
                                    <>
                                        <p className="mx-auto text-base lg:text-xl sm:text-lg text-fg-muted">
                                            {currentItem}
                                            {currentSet > 1 &&
                                                ` · Set ${currentSetCounter}/${currentSet}`}
                                        </p>
                                        <p className="mx-auto text-3xl lg:text-5xl sm:text-4xl font-mono font-semibold">
                                            {`${getTwoDigits(
                                                Math.floor(currentTimer / 60)
                                            )}:${getTwoDigits(currentTimer % 60)}`}
                                        </p>
                                    </>
                                )
                            )}
                        </div>
                        <div className="mx-auto p-2">
                            <Button
                                type="danger"
                                onClick={handleDeactivate}
                                autofocus
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                    <p className="text-base lg:text-xl sm:text-lg mx-auto text-fg-muted">
                        Please keep the window open!
                    </p>
                </>
            )}
            <Audio
                audioRef={audioRefPreCountdown}
                src="./audio/preCountdown.mp3"
                loop={false}
            />
            <Audio
                audioRef={audioRefBeepLong}
                src="./audio/beepLong.mp3"
                loop={false}
            />
            <Audio
                audioRef={audioRefBeep}
                src="./audio/beep.mp3"
                loop={false}
            />
        </>
    )
}

export default Countdown
