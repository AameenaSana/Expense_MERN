import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { getCategory } from '../../utils/categories'
import {
    currentMonthKey, formatCurrency, formatPercent, monthKey, monthLabel,
    percentChange, shiftMonth, sumAmounts,
} from '../../utils/format'
import { Card, CardHeader } from '../ui/Card'
import { Button } from '../ui/Button'
import Icon from '../ui/Icon'
import EmptyState from '../ui/EmptyState'
import MonthSwitcher from '../ui/MonthSwitcher'
import ProgressBar from '../ui/ProgressBar'
import TransactionRow, { TransactionList } from '../Transactions/TransactionRow'
import StatCard from './StatCard'
import { CategoryChart, TrendChart } from './Charts'

const TREND_MONTHS = 6

// Start on the current month if it has activity; otherwise jump to the most
// recent month that does, so the dashboard doesn't open on empty cards.
const initialMonth = (transactions) => {
    const current = currentMonthKey()
    const months = [...new Set(transactions.map((t) => monthKey(t.date)))].sort()
    if (!months.length || months.includes(current)) return current
    const past = months.filter((m) => m < current)
    return past.length ? past[past.length - 1] : months[months.length - 1]
}

function Dashboard({onAdd, onEdit, onNavigate}) {
    const {transactions, budgets, currency} = useGlobalContext()
    const [month, setMonth] = useState(() => initialMonth(transactions))
    const fmt = (n) => formatCurrency(n, currency)

    const stats = useMemo(() => {
        const byMonth = (key) => transactions.filter((t) => monthKey(t.date) === key)
        const totals = (list) => {
            const income = sumAmounts(list.filter((t) => t.type === 'income'))
            const expense = sumAmounts(list.filter((t) => t.type === 'expense'))
            return {income, expense, net: income - expense}
        }

        const current = byMonth(month)
        const now = totals(current)
        const prev = totals(byMonth(shiftMonth(month, -1)))

        // Spending per category this month
        const spendMap = {}
        current.filter((t) => t.type === 'expense').forEach((t) => {
            spendMap[t.category] = (spendMap[t.category] || 0) + t.amount
        })
        const categories = Object.entries(spendMap)
            .map(([category, amount]) => ({...getCategory('expense', category), category, amount}))
            .sort((a, b) => b.amount - a.amount)

        // Last N months ending at the selected month
        const trendKeys = Array.from({length: TREND_MONTHS}, (_, i) => shiftMonth(month, i - TREND_MONTHS + 1))
        const trend = trendKeys.map((key) => totals(byMonth(key)))

        const budgetRows = budgets
            .map((b) => {
                const spent = spendMap[b.category] || 0
                return {...getCategory('expense', b.category), budget: b.amount, spent, ratio: spent / b.amount}
            })
            .sort((a, b) => b.ratio - a.ratio)

        const allTime = totals(transactions)

        return {now, prev, categories, trendKeys, trend, budgetRows, allTime}
    }, [transactions, budgets, month])

    const {now, prev, categories, trendKeys, trend, budgetRows, allTime} = stats
    const prevLabel = `vs ${monthLabel(shiftMonth(month, -1), 'short')}`
    const savingsRate = now.income > 0 ? (now.net / now.income) * 100 : null
    const recent = transactions.slice(0, 6)
    const hasTrendData = trend.some((t) => t.income || t.expense)

    if (!transactions.length) {
        return (
            <Card>
                <EmptyState
                    icon="chart-pie"
                    title="Welcome! Let's get started"
                    message="Add your income and expenses to see totals, trends and where your money goes."
                    action={
                        <div style={{display: 'flex', gap: '.5rem'}}>
                            <Button $variant="secondary" onClick={() => onAdd('income')}><Icon name="plus" /> Add income</Button>
                            <Button onClick={() => onAdd('expense')}><Icon name="plus" /> Add expense</Button>
                        </div>
                    }
                />
            </Card>
        )
    }

    return (
        <Wrap>
            <div className="period">
                <MonthSwitcher value={month} onChange={setMonth} />
            </div>

            <div className="stats">
                <StatCard
                    label="Income"
                    value={fmt(now.income)}
                    icon="arrow-trend-up"
                    tone="income"
                    change={percentChange(now.income, prev.income)}
                    changeLabel={prevLabel}
                    footnote="No income last month to compare"
                />
                <StatCard
                    label="Expenses"
                    value={fmt(now.expense)}
                    icon="arrow-trend-down"
                    tone="expense"
                    upIsGood={false}
                    change={percentChange(now.expense, prev.expense)}
                    changeLabel={prevLabel}
                    footnote="No expenses last month to compare"
                />
                <StatCard
                    label="Net savings"
                    value={fmt(now.net)}
                    icon="piggy-bank"
                    tone="primary"
                    footnote={savingsRate === null ? 'No income this month' : `${formatPercent(savingsRate)} of income saved`}
                />
                <StatCard
                    label="Total balance"
                    value={fmt(allTime.net)}
                    icon="scale-balanced"
                    tone="neutral"
                    footnote="All income minus all expenses"
                />
            </div>

            <div className="grid">
                <Card>
                    <CardHeader>
                        <div>
                            <h2>Income vs expenses</h2>
                            <p>Last {TREND_MONTHS} months</p>
                        </div>
                    </CardHeader>
                    <div className="chart">
                        {hasTrendData ? (
                            <TrendChart
                                labels={trendKeys.map((k) => monthLabel(k, 'short'))}
                                income={trend.map((t) => t.income)}
                                expense={trend.map((t) => t.expense)}
                                currency={currency}
                            />
                        ) : (
                            <EmptyState icon="chart-column" title="No data for this period" />
                        )}
                    </div>
                </Card>

                <Card>
                    <CardHeader>
                        <div>
                            <h2>Spending by category</h2>
                            <p>{monthLabel(month)}</p>
                        </div>
                    </CardHeader>
                    {categories.length ? (
                        <div className="breakdown">
                            <div className="donut">
                                <CategoryChart items={categories} currency={currency} />
                                <div className="donut-center">
                                    <span>Spent</span>
                                    <strong className="num">{fmt(now.expense)}</strong>
                                </div>
                            </div>
                            <ul className="legend">
                                {categories.slice(0, 6).map((c) => (
                                    <li key={c.category}>
                                        <span className="swatch" style={{background: c.color}} />
                                        <span className="name">{c.label}</span>
                                        <span className="pct">{formatPercent((c.amount / now.expense) * 100)}</span>
                                        <span className="amt num">{fmt(c.amount)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <EmptyState icon="receipt" title="No spending this month" message="Expenses you add will be broken down here." />
                    )}
                </Card>

                <Card>
                    <CardHeader>
                        <h2>Recent transactions</h2>
                        <Button $variant="ghost" $size="sm" onClick={() => onNavigate('transactions')}>
                            View all <Icon name="arrow-right" />
                        </Button>
                    </CardHeader>
                    <TransactionList>
                        {recent.map((t) => <TransactionRow key={t._id} transaction={t} onEdit={onEdit} />)}
                    </TransactionList>
                </Card>

                <Card>
                    <CardHeader>
                        <div>
                            <h2>Budgets</h2>
                            <p>{monthLabel(month)}</p>
                        </div>
                        <Button $variant="ghost" $size="sm" onClick={() => onNavigate('budgets')}>
                            Manage <Icon name="arrow-right" />
                        </Button>
                    </CardHeader>
                    {budgetRows.length ? (
                        <ul className="budgets">
                            {budgetRows.slice(0, 5).map((b) => (
                                <li key={b.value}>
                                    <div className="budget-top">
                                        <span>{b.label}</span>
                                        <span className="num">
                                            {fmt(b.spent)} <span className="of">of {fmt(b.budget)}</span>
                                        </span>
                                    </div>
                                    <ProgressBar ratio={b.ratio} label={`${b.label} budget used`} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState
                            icon="bullseye"
                            title="No budgets set"
                            message="Set monthly limits to keep spending on track."
                            action={<Button $variant="secondary" $size="sm" onClick={() => onNavigate('budgets')}>Set a budget</Button>}
                        />
                    )}
                </Card>
            </div>
        </Wrap>
    )
}

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .period{
        display: flex;
        justify-content: flex-end;
    }

    .stats{
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1rem;
        @media (max-width: 1200px){ grid-template-columns: repeat(2, minmax(0, 1fr)); }
        @media (max-width: 560px){ grid-template-columns: minmax(0, 1fr); }
    }

    .grid{
        display: grid;
        grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
        gap: 1rem;
        @media (max-width: 1100px){ grid-template-columns: minmax(0, 1fr); }
    }

    .chart{
        height: 280px;
    }

    .breakdown{
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .donut{
        position: relative;
        height: 180px;
    }
    .donut-center{
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        span{
            font-size: .75rem;
            color: var(--text-muted);
        }
        strong{
            font-size: 1.05rem;
        }
    }

    .legend{
        display: flex;
        flex-direction: column;
        gap: .5rem;
        li{
            display: grid;
            grid-template-columns: 10px 1fr auto auto;
            align-items: center;
            gap: .625rem;
            font-size: .875rem;
        }
        .swatch{
            width: 10px;
            height: 10px;
            border-radius: 3px;
        }
        .pct{
            color: var(--text-muted);
            font-size: .8rem;
        }
        .amt{
            font-weight: 600;
            min-width: 80px;
            text-align: right;
        }
    }

    .budgets{
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .budget-top{
        display: flex;
        justify-content: space-between;
        gap: .5rem;
        margin-bottom: .375rem;
        font-size: .875rem;
        font-weight: 500;
        .of{
            color: var(--text-muted);
            font-weight: 400;
        }
    }
`;

export default Dashboard
