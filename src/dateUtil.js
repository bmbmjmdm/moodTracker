// Returns the date's abreviate month + date
export function getDateShort (date) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
                        "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${monthNames[date.getMonth()]} ${date.getDate()}`
}

// returns the date's full month, date, and time with a saved blurb
export function getSaveTime (date) {
    return `Saved on ${getMonth(date)} ${date.getDate()} at ${get12HourTime(date)}`
}

// simply turns the date's month into a string
export function getMonth (date) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July",
                        "August", "September", "October", "November", "December"]
    return monthNames[date.getMonth()]
}

function get12HourTime (date) {
    var hours = date.getHours()
    var mid = 'am'
    // At 00 hours we need to show 12 am
    if (hours === 0){
        hours = 12
    }
    // if we're past 12, we're in the pm and need to subtract 12
    else if (hours > 12)
    {
        hours = hours % 12
        mid = 'pm'
    }
    return `${hours}:${date.getMinutes()}${mid}`
}

// We dont care about year, so only compare date and month
export function sameDate (date1, date2) {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth()
}