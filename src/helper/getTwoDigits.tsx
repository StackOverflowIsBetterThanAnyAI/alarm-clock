export const getTwoDigits = (num: number | string) => {
    if (typeof num === 'number') return num >= 10 ? num : `0${num}`
    return parseInt(num) >= 10 ? num : `0${num.replace('0', '')}`
}
