import { FC } from 'react'
import Select from './Select'
import Button from './Button'

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
    popupRef: React.MutableRefObject<HTMLDivElement | null>
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
        <div className="fixed top-0 left-0 w-full h-full bg-zinc-950/50">
            <div
                className="absolute left-0 right-0 top-8 mx-auto bg-zinc-600 text-zinc-50 w-4/5 px-4 py-2 rounded-md z-50"
                ref={popupRef}
            >
                <h2 className="m-auto text-xl lg:text-3xl sm:text-2xl pb-2">
                    New Countdown
                </h2>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-baseline justify-between">
                        <Select
                            id="Countdown in Minutes"
                            onChange={handleCountdownMinutes}
                            options={countdownMinutes}
                            value={currentCountdownMinutes}
                            autofocus
                        />
                    </div>
                    <div className="flex flex-row items-baseline justify-between">
                        <Select
                            id="Countdown in Seconds"
                            onChange={handleCountdownSeconds}
                            options={countdownSeconds}
                            value={currentCountdownSeconds}
                        />
                    </div>
                    <div className="flex flex-row items-baseline justify-between">
                        <Select
                            id="sets"
                            onChange={handleSets}
                            options={sets}
                            value={currentSet}
                        />
                    </div>
                    {currentSet > 1 && (
                        <div className="flex flex-row items-baseline justify-between">
                            <label
                                htmlFor="Break in Between"
                                className="text-base lg:text-xl sm:text-lg"
                            >
                                Break in Between?
                            </label>
                            <button
                                id="Break in Between"
                                onClick={handleBreakEnabled}
                                className="px-4 outline outline-1 rounded-md bg-zinc-700 outline-zinc-50 min-w-14 min-h-8
                            focus:outline-4
                            hover:bg-zinc-500
                            active:bg-zinc-700"
                            >{`${breakEnabled ? '✔️' : '❌'}`}</button>
                        </div>
                    )}
                    {breakEnabled && currentSet > 1 && (
                        <div className="flex flex-row items-baseline justify-between">
                            <Select
                                id="Break in Seconds"
                                onChange={handleBreakSeconds}
                                options={breakSeconds}
                                value={currentBreak}
                            />
                        </div>
                    )}
                    <div className="flex justify-between pt-4 pb-2">
                        <Button onClick={handleCancel} type="red">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSetCountdownActive}
                            type="green"
                            disabled={
                                currentCountdownMinutes === 0 &&
                                currentCountdownSeconds === 0
                            }
                        >
                            Start
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CountdownPopup
