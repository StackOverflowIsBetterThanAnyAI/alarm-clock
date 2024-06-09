import { FC } from 'react'

type AudioProps = {
    audioRef: React.RefObject<HTMLAudioElement>
    loop: boolean
    src: string
}

const Audio: FC<AudioProps> = ({ audioRef, loop, src }) => {
    return (
        <audio ref={audioRef} preload="metadata" src={src} loop={loop}>
            Your browser does not support the audio element.
        </audio>
    )
}

export default Audio
