// Formatting and date helpers.
// Dates are stored as UTC midnight of the chosen day, so every date
// calculation here uses UTC to avoid showing the wrong day or month
// in timezones behind UTC.

const pad = (n) => String(n).padStart(2, '0')

const currencyFormatters = {}
export const formatCurrency = (amount, currency = 'USD', options = {}) => {
    const key = currency + JSON.stringify(options)
    if (!currencyFormatters[key]) {
        try {
            currencyFormatters[key] = new Intl.NumberFormat(undefined, {style: 'currency', currency, ...options})
        } catch {
            currencyFormatters[key] = new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', ...options})
        }
    }
    return currencyFormatters[key].format(Number(amount) || 0)
}

export const formatCompactCurrency = (amount, currency) =>
    formatCurrency(amount, currency, {notation: 'compact', maximumFractionDigits: 1})

export const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'})

export const formatPercent = (value) => `${Math.round(value)}%`

// "YYYY-MM" key for the month a stored date falls in
export const monthKey = (date) => {
    const d = new Date(date)
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`
}

// The user's current month, in their local time
export const currentMonthKey = () => {
    const d = new Date()
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
}

export const shiftMonth = (key, delta) => {
    const [y, m] = key.split('-').map(Number)
    const d = new Date(Date.UTC(y, m - 1 + delta, 1))
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`
}

export const monthLabel = (key, style = 'long') => {
    const [y, m] = key.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(undefined, {
        month: style,
        year: style === 'long' ? 'numeric' : undefined,
        timeZone: 'UTC',
    })
}

// Value for an <input type="date"> from a stored date
export const toInputDate = (date) => new Date(date).toISOString().slice(0, 10)

// Today's local date as YYYY-MM-DD
export const todayInput = () => {
    const d = new Date()
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const sumAmounts = (list) => list.reduce((total, item) => total + item.amount, 0)

// Percentage change, or null when there is no previous value to compare with
export const percentChange = (current, previous) =>
    previous > 0 ? ((current - previous) / previous) * 100 : null
