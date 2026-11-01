import { FC } from 'react'
import Button from './Button'
import Dialog from './Dialog'
import Select from './Select'

type AlarmPopupProps = {
    estimatedAlarmTime: string
    handleCancel: () => void
    handleMinutesChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
    handleSecondsChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
    handleSetAlarmActive: () => void
    minutes: number[]
    popupRef: React.RefObject<HTMLDivElement | null>
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
        <Dialog
            title="New Alarm"
            handleCancel={handleCancel}
            popupRef={popupRef}
        >
            <div className="flex justify-between items-baseline">
                <div className="flex items-baseline gap-2">
                    <Select
                        label="Minutes"
                        onChange={handleMinutesChange}
                        value={ringsIn.minutes}
                        options={minutes}
                        autofocus
                    />
                </div>
                <div className="flex items-baseline gap-2">
                    <Select
                        label="Seconds"
                        onChange={handleSecondsChange}
                        value={ringsIn.seconds}
                        options={seconds}
                    />
                </div>
            </div>
            <p
                className="mx-auto text-lg lg:text-2xl sm:text-xl pt-2"
                aria-live="polite"
            >
                {`The alarm rings at ${estimatedAlarmTime}.`}
            </p>
            <div className="flex justify-between pt-4 pb-2">
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSetAlarmActive} type="primary">
                    Set Alarm
                </Button>
            </div>
        </Dialog>
    )
}

export default AlarmPopup
