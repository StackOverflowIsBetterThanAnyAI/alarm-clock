import { FC } from 'react'
import Button from './Button'
import Select from './Select'

type AlarmPopupProps = {
    estimatedAlarmTime: string
    handleCancel: () => void
    handleMinutesChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
    handleSecondsChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
    handleSetAlarmActive: () => void
    minutes: number[]
    popupRef: React.MutableRefObject<HTMLDivElement | null>
    ringsIn: {
        minutes: number
        seconds: number
    }
    seconds: number[]
}

const AlarmPopup: FC<AlarmPopupProps> = ({
    estimatedAlarmTime,
    handleCancel,
    handleMinutesChange,
    handleSecondsChange,
    handleSetAlarmActive,
    minutes,
    popupRef,
    ringsIn,
    seconds,
}) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-zinc-950/50">
            <div
                className="absolute left-0 right-0 top-8 mx-auto bg-zinc-600 text-zinc-50 w-4/5 px-4 py-2 rounded-md z-50"
                ref={popupRef}
            >
                <h2 className="m-auto text-xl lg:text-3xl sm:text-2xl pb-2">
                    New Alarm
                </h2>
                <div className="flex justify-between items-baseline">
                    <div className="flex items-baseline gap-2">
                        <Select
                            id="minutes"
                            onChange={handleMinutesChange}
                            value={ringsIn.minutes}
                            options={minutes}
                            autofocus
                        />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <Select
                            id="seconds"
                            onChange={handleSecondsChange}
                            value={ringsIn.seconds}
                            options={seconds}
                        />
                    </div>
                </div>
                <h3 className="m-auto text-lg lg:text-2xl sm:text-xl pt-2">
                    {`The alarm rings at ${estimatedAlarmTime}.`}
                </h3>
                <div className="flex justify-between pt-4 pb-2">
                    <Button onClick={handleCancel} type="red">
                        Cancel
                    </Button>
                    <Button onClick={handleSetAlarmActive} type="green">
                        Set Alarm
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AlarmPopup
