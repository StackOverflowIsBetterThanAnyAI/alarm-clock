import { getTwoDigits } from './getTwoDigits'

export const getTimeFormat = (time: string): string => {
    const timeParts = time
        .replaceAll(' ', '')
        .split(':')
        .map((item) => parseInt(item))

    const seconds = getTwoDigits(timeParts[2] % 60)

    const minutes = getTwoDigits(
        (timeParts[1] + Math.floor(timeParts[2] / 60)) % 60
    )

    const hours = getTwoDigits(
        (timeParts[0] +
            Math.floor((timeParts[1] + Math.floor(timeParts[2] / 60)) / 60)) %
            24
    )

    return `${hours} : ${minutes} : ${seconds}`
}
