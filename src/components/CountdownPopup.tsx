import { FC } from 'react'
import Select from './Select'
import Button from './Button'
import Dialog from './Dialog'

type CountdownPopupProps = {
    breakEnabled: boolean
    breakSeconds: number[]
    countdownMinutes: number[]
    countdownSeconds: number[]
    currentBreak: number
    currentCountdownMinutes: number
    currentCountdownSeconds: number
    currentSet: number
    handleBreakEnabled: () => void
    handleBreakSeconds: (e: React.ChangeEvent<HTMLSelectElement>) => void
    handleCancel: () => void
    handleCountdownMinutes: (e: React.ChangeEvent<HTMLSelectElement>) => void
    handleCountdownSeconds: (e: React.ChangeEvent<HTMLSelectElement>) => void
    handleSetCountdownActive: () => void
    handleSets: (e: React.ChangeEvent<HTMLSelectElement>) => void
    popupRef: React.RefObject<HTMLDivElement | null>
    sets: number[]
}

const CountdownPopup: FC<CountdownPopupProps> = ({
    breakEnabled,
    breakSeconds,
    countdownMinutes,
    countdownSeconds,
    currentBreak,
    currentCountdownMinutes,
    currentCountdownSeconds,
    currentSet,
    handleBreakEnabled,
    handleBreakSeconds,
    handleCancel,
    handleCountdownMinutes,
    handleCountdownSeconds,
    handleSetCountdownActive,
    handleSets,
    popupRef,
    sets,
}) => {
    return (
        <Dialog
            title="New Countdown"
            handleCancel={handleCancel}
            popupRef={popupRef}
        >
            <div className="flex flex-col gap-2">
                <div className="flex flex-row items-baseline justify-between">
                    <Select
                        label="Countdown in Minutes"
                        onChange={handleCountdownMinutes}
                        options={countdownMinutes}
                        value={currentCountdownMinutes}
                        autofocus
                    />
                </div>
                <div className="flex flex-row items-baseline justify-between">
                    <Select
                        label="Countdown in Seconds"
                        onChange={handleCountdownSeconds}
                        options={countdownSeconds}
                        value={currentCountdownSeconds}
                    />
                </div>
                <div className="flex flex-row items-baseline justify-between">
                    <Select
                        label="Sets"
                        onChange={handleSets}
                        options={sets}
                        value={currentSet}
                    />
                </div>
                {currentSet > 1 && (
                    <div className="flex flex-row items-baseline justify-between">
                        <span
                            id="break-in-between-label"
                            className="text-base lg:text-xl sm:text-lg"
                        >
                            Break in Between?
                        </span>
                        <button
                            role="switch"
                            aria-checked={breakEnabled}
                            aria-labelledby="break-in-between-label"
                            onClick={handleBreakEnabled}
                            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors ${
                                breakEnabled
                                    ? 'bg-accent border-accent'
                                    : 'bg-surface border-line'
                            }`}
                        >
                            <span
                                aria-hidden="true"
                                className={`inline-block size-5 rounded-full transition-transform motion-reduce:transition-none ${
                                    breakEnabled
                                        ? 'translate-x-6 bg-on-accent'
                                        : 'translate-x-1 bg-fg-muted'
                                }`}
                            />
                        </button>
                    </div>
                )}
                {breakEnabled && currentSet > 1 && (
                    <div className="flex flex-row items-baseline justify-between">
                        <Select
                            label="Break in Seconds"
                            onChange={handleBreakSeconds}
                            options={breakSeconds}
                            value={currentBreak}
                        />
                    </div>
                )}
                <div className="flex justify-between pt-4 pb-2">
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button
                        onClick={handleSetCountdownActive}
                        type="primary"
                        disabled={
                            currentCountdownMinutes === 0 &&
                            currentCountdownSeconds === 0
                        }
                    >
                        Start
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default CountdownPopup
