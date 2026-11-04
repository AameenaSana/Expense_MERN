import { getCategory } from './categories'
import { toInputDate, todayInput } from './format'

const escapeCell = (value, isText) => {
    let s = String(value ?? '')
    // Stop spreadsheet apps from treating text as a formula
    if (isText && /^[=+\-@\t\r]/.test(s)) s = `'${s}`
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

// Download the given transactions as a CSV file
export const exportTransactionsCsv = (transactions, currency) => {
    const header = ['Date', 'Type', 'Title', 'Category', 'Amount', 'Currency', 'Note']
    const rows = transactions.map((t) => [
        [toInputDate(t.date), false],
        [t.type === 'income' ? 'Income' : 'Expense', false],
        [t.title, true],
        [getCategory(t.type, t.category).label, true],
        [(t.type === 'expense' ? -t.amount : t.amount).toFixed(2), false],
        [currency, false],
        [t.description, true],
    ])

    const csv = [
        header.map((h) => escapeCell(h, false)).join(','),
        ...rows.map((row) => row.map(([value, isText]) => escapeCell(value, isText)).join(',')),
    ].join('\r\n')

    // BOM so Excel detects UTF-8
    const blob = new Blob(['﻿' + csv], {type: 'text/csv;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions-${todayInput()}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 0)
}
