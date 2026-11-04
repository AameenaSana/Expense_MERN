import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { EXPENSE_CATEGORIES } from '../../utils/categories'
import { currentMonthKey, formatCurrency, monthKey, sumAmounts } from '../../utils/format'
import { Card, CardHeader } from '../ui/Card'
import { Button, IconButton } from '../ui/Button'
import { Input } from '../ui/Field'
import Icon from '../ui/Icon'
import CategoryIcon from '../ui/CategoryIcon'
import MonthSwitcher from '../ui/MonthSwitcher'
import ProgressBar, { progressTone } from '../ui/ProgressBar'

function BudgetRow({category, budget, spent, currency}) {
    const {saveBudget, deleteBudget} = useGlobalContext()
    const [draft, setDraft] = useState(budget ? String(budget) : '')
    const [saving, setSaving] = useState(false)
    const fmt = (n) => formatCurrency(n, currency)

    // Keep the input in sync when the saved value changes elsewhere
    const [lastBudget, setLastBudget] = useState(budget)
    if (budget !== lastBudget) {
        setLastBudget(budget)
        setDraft(budget ? String(budget) : '')
    }

    const amount = Number(draft)
    const valid = draft !== '' && Number.isFinite(amount) && amount > 0
    const dirty = valid && amount !== budget

    const save = async (e) => {
        e.preventDefault()
        if (!dirty || saving) return
        setSaving(true)
        await saveBudget(category.value, amount)
        setSaving(false)
    }

    const remove = async () => {
        setSaving(true)
        await deleteBudget(category.value)
        setSaving(false)
    }

    const ratio = budget ? spent / budget : 0
    const tone = progressTone(ratio)

    return (
        <Row onSubmit={save}>
            <div className="name">
                <CategoryIcon type="expense" category={category.value} size={36} />
                <div>
                    <span className="label">{category.label}</span>
                    <span className="spent num">{fmt(spent)} spent</span>
                </div>
            </div>

            <div className="progress">
                {budget ? (
                    <>
                        <ProgressBar ratio={ratio} label={`${category.label} budget used`} />
                        <span className={`status ${tone}`}>
                            {ratio > 1
                                ? `${fmt(spent - budget)} over budget`
                                : `${fmt(budget - spent)} left · ${Math.round(ratio * 100)}% used`}
                        </span>
                    </>
                ) : (
                    <span className="status muted">No budget set</span>
                )}
            </div>

            <div className="controls">
                <Input
                    type="number"
                    inputMode="decimal"
                    min="0.01"
                    step="0.01"
                    placeholder="Monthly limit"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    aria-label={`Monthly budget for ${category.label}`}
                />
                <Button type="submit" $size="sm" disabled={!dirty || saving}>
                    {budget ? 'Update' : 'Set'}
                </Button>
                {budget ? (
                    <IconButton $variant="ghost" $size="sm" aria-label={`Remove ${category.label} budget`} title="Remove budget" onClick={remove} disabled={saving}>
                        <Icon name="xmark" />
                    </IconButton>
                ) : <span className="spacer" />}
            </div>
        </Row>
    )
}

function Budgets() {
    const {budgets, transactions, currency} = useGlobalContext()
    const [month, setMonth] = useState(currentMonthKey)
    const fmt = (n) => formatCurrency(n, currency)

    const {rows, totalBudget, totalSpent, unbudgeted} = useMemo(() => {
        const spending = {}
        transactions
            .filter((t) => t.type === 'expense' && monthKey(t.date) === month)
            .forEach((t) => { spending[t.category] = (spending[t.category] || 0) + t.amount })

        const budgetMap = Object.fromEntries(budgets.map((b) => [b.category, b.amount]))
        const list = EXPENSE_CATEGORIES.map((c) => ({
            category: c,
            budget: budgetMap[c.value],
            spent: spending[c.value] || 0,
        }))
        // Budgeted categories first, then by spending
        list.sort((a, b) => (Boolean(b.budget) - Boolean(a.budget)) || b.spent - a.spent)

        const budgeted = list.filter((r) => r.budget)
        return {
            rows: list,
            totalBudget: sumAmounts(budgeted.map((r) => ({amount: r.budget}))),
            totalSpent: sumAmounts(budgeted.map((r) => ({amount: r.spent}))),
            unbudgeted: sumAmounts(list.filter((r) => !r.budget).map((r) => ({amount: r.spent}))),
        }
    }, [budgets, transactions, month])

    const overallRatio = totalBudget ? totalSpent / totalBudget : 0

    return (
        <Wrap>
            <div className="period">
                <MonthSwitcher value={month} onChange={setMonth} />
            </div>

            <Card>
                <div className="overview">
                    <div>
                        <span className="k">Total budget</span>
                        <span className="v num">{fmt(totalBudget)}</span>
                    </div>
                    <div>
                        <span className="k">Spent in budgeted categories</span>
                        <span className="v num">{fmt(totalSpent)}</span>
                    </div>
                    <div>
                        <span className="k">{totalSpent > totalBudget ? 'Over budget' : 'Remaining'}</span>
                        <span className={`v num ${totalSpent > totalBudget ? 'over' : ''}`}>{fmt(Math.abs(totalBudget - totalSpent))}</span>
                    </div>
                    <div>
                        <span className="k">Spent without a budget</span>
                        <span className="v num">{fmt(unbudgeted)}</span>
                    </div>
                </div>
                {totalBudget > 0 && (
                    <div className="overall">
                        <ProgressBar ratio={overallRatio} label="Overall budget used" />
                    </div>
                )}
            </Card>

            <Card>
                <CardHeader>
                    <div>
                        <h2>Monthly limits</h2>
                        <p>Limits apply to every month. Progress shows spending for the selected month.</p>
                    </div>
                </CardHeader>
                <div className="rows">
                    {rows.map((r) => (
                        <BudgetRow key={r.category.value} {...r} currency={currency} />
                    ))}
                </div>
            </Card>
        </Wrap>
    )
}

const Row = styled.form`
    display: grid;
    grid-template-columns: minmax(180px, 1.2fr) minmax(160px, 2fr) auto;
    align-items: center;
    gap: 1.25rem;
    padding: .875rem 0;
    border-bottom: 1px solid var(--border);
    &:last-child{
        border-bottom: none;
    }

    .name{
        display: flex;
        align-items: center;
        gap: .75rem;
        min-width: 0;
        > div{
            display: flex;
            flex-direction: column;
            min-width: 0;
        }
    }
    .label{
        font-weight: 500;
    }
    .spent{
        font-size: .8rem;
        color: var(--text-muted);
    }

    .progress{
        display: flex;
        flex-direction: column;
        gap: .375rem;
    }
    .status{
        font-size: .8rem;
        &.ok{ color: var(--text-muted); }
        &.near{ color: var(--warning); font-weight: 500; }
        &.over{ color: var(--expense); font-weight: 500; }
        &.muted{ color: var(--text-subtle); }
    }

    .controls{
        display: flex;
        align-items: center;
        gap: .5rem;
        input{
            width: 140px;
            height: 32px;
        }
        .spacer{
            width: 32px;
        }
    }

    @media (max-width: 760px){
        grid-template-columns: 1fr;
        gap: .75rem;
        .controls input{
            flex: 1;
            width: auto;
        }
    }
`;

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .period{
        display: flex;
        justify-content: flex-end;
    }

    .overview{
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 1rem;
        @media (max-width: 900px){ grid-template-columns: repeat(2, minmax(0, 1fr)); }
        > div{
            display: flex;
            flex-direction: column;
            gap: .25rem;
        }
        .k{
            font-size: .8rem;
            color: var(--text-muted);
        }
        .v{
            font-size: 1.25rem;
            font-weight: 700;
            &.over{ color: var(--expense); }
        }
    }
    .overall{
        margin-top: 1rem;
    }

    .rows{
        margin: -.875rem 0;
    }
`;

export default Budgets
