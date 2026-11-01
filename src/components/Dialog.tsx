import { FC, ReactNode, useId, useLayoutEffect, useRef } from 'react'

type DialogProps = {
    children: ReactNode
    handleCancel: () => void
    popupRef: React.RefObject<HTMLDivElement | null>
    title: string
}

const Dialog: FC<DialogProps> = ({
    children,
    handleCancel,
    popupRef,
    title,
}) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null)
    const titleId = useId()

    useLayoutEffect(() => {
        const dialog = dialogRef.current
        const opener = document.activeElement as HTMLElement | null
        dialog?.showModal()
        return () => {
            dialog?.close()
            if (opener?.isConnected) opener.focus()
        }
    }, [])

    const handleDialogCancel = (event: React.SyntheticEvent) => {
        event.preventDefault()
        handleCancel()
    }

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            onCancel={handleDialogCancel}
            className="fixed inset-0 w-full h-full max-w-none max-h-none m-0 p-0 bg-scrim backdrop:bg-transparent"
        >
            <div
                className="absolute left-0 right-0 top-8 mx-auto bg-surface text-fg border border-line shadow-xl w-4/5 px-5 py-4 rounded-xl z-50"
                ref={popupRef}
            >
                <h2
                    id={titleId}
                    className="mx-auto text-xl lg:text-3xl sm:text-2xl font-semibold pb-3"
                >
                    {title}
                </h2>
                {children}
            </div>
        </dialog>
    )
}

export default Dialog
