import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategory } from '../../utils/categories'
import { exportTransactionsCsv } from '../../utils/csv'
import { formatCurrency, monthKey, monthLabel, sumAmounts } from '../../utils/format'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input, Select } from '../ui/Field'
import Icon from '../ui/Icon'
import EmptyState from '../ui/EmptyState'
import ConfirmDialog from '../ui/ConfirmDialog'
import TransactionRow, { TransactionList } from './TransactionRow'

const PAGE_SIZE = 50

const DEFAULT_FILTERS = {search: '', type: 'all', category: 'all', month: 'all', sort: 'newest'}

const SORTERS = {
    newest: (a, b) => new Date(b.date) - new Date(a.date) || new Date(b.createdAt) - new Date(a.createdAt),
    oldest: (a, b) => new Date(a.date) - new Date(b.date) || new Date(a.createdAt) - new Date(b.createdAt),
    highest: (a, b) => b.amount - a.amount,
    lowest: (a, b) => a.amount - b.amount,
}

function Transactions({onAdd, onEdit}) {
    const {transactions, deleteTransaction, currency} = useGlobalContext()
    const [filters, setFilters] = useState(DEFAULT_FILTERS)
    const [visible, setVisible] = useState(PAGE_SIZE)
    const [pendingDelete, setPendingDelete] = useState(null)

    const setFilter = (name) => (e) => {
        const value = e.target.value
        setVisible(PAGE_SIZE)
        setFilters((f) => {
            const next = {...f, [name]: value}
            // A category filter belongs to one type; drop it if the type no longer matches
            if (name === 'type' && f.category !== 'all' && value !== 'all' && !f.category.startsWith(`${value}:`)) {
                next.category = 'all'
            }
            return next
        })
    }

    const months = useMemo(() => (
        [...new Set(transactions.map((t) => monthKey(t.date)))].sort().reverse()
    ), [transactions])

    const filtered = useMemo(() => {
        const query = filters.search.trim().toLowerCase()
        return transactions
            .filter((t) => {
                if (filters.type !== 'all' && t.type !== filters.type) return false
                if (filters.category !== 'all') {
                    const [type, category] = filters.category.split(':')
                    if (t.type !== type || t.category !== category) return false
                }
                if (filters.month !== 'all' && monthKey(t.date) !== filters.month) return false
                if (query) {
                    const haystack = `${t.title} ${t.description || ''} ${getCategory(t.type, t.category).label}`.toLowerCase()
                    if (!haystack.includes(query)) return false
                }
                return true
            })
            .sort(SORTERS[filters.sort])
    }, [transactions, filters])

    const income = sumAmounts(filtered.filter((t) => t.type === 'income'))
    const expense = sumAmounts(filtered.filter((t) => t.type === 'expense'))
    const isFiltered = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS)
    const fmt = (n) => formatCurrency(n, currency)

    const categoryGroups = [
        filters.type !== 'expense' && {label: 'Income', type: 'income', list: INCOME_CATEGORIES},
        filters.type !== 'income' && {label: 'Expense', type: 'expense', list: EXPENSE_CATEGORIES},
    ].filter(Boolean)

    return (
        <Wrap>
            <Card>
                <div className="toolbar">
                    <div className="search">
                        <Icon name="magnifying-glass" />
                        <Input
                            type="search"
                            placeholder="Search title, note or category"
                            value={filters.search}
                            onChange={setFilter('search')}
                            aria-label="Search transactions"
                        />
                    </div>
                    <Select value={filters.type} onChange={setFilter('type')} aria-label="Type">
                        <option value="all">All types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expenses</option>
                    </Select>
                    <Select value={filters.category} onChange={setFilter('category')} aria-label="Category">
                        <option value="all">All categories</option>
                        {categoryGroups.map((group) => (
                            <optgroup key={group.type} label={group.label}>
                                {group.list.map((c) => (
                                    <option key={c.value} value={`${group.type}:${c.value}`}>{c.label}</option>
                                ))}
                            </optgroup>
                        ))}
                    </Select>
                    <Select value={filters.month} onChange={setFilter('month')} aria-label="Month">
                        <option value="all">All time</option>
                        {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
                    </Select>
                    <Select value={filters.sort} onChange={setFilter('sort')} aria-label="Sort">
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="highest">Highest amount</option>
                        <option value="lowest">Lowest amount</option>
                    </Select>
                </div>

                <div className="summary">
                    <p>
                        <strong>{filtered.length}</strong> {filtered.length === 1 ? 'transaction' : 'transactions'}
                        <span className="dot">·</span>
                        <span className="income num">+{fmt(income)}</span>
                        <span className="dot">·</span>
                        <span className="num">−{fmt(expense)}</span>
                        <span className="dot">·</span>
                        Net <strong className="num">{fmt(income - expense)}</strong>
                    </p>
                    <div className="summary-actions">
                        {isFiltered && (
                            <Button $variant="ghost" $size="sm" onClick={() => setFilters(DEFAULT_FILTERS)}>
                                Clear filters
                            </Button>
                        )}
                        <Button
                            $variant="secondary"
                            $size="sm"
                            disabled={!filtered.length}
                            onClick={() => exportTransactionsCsv(filtered, currency)}
                        >
                            <Icon name="file-arrow-down" /> Export CSV
                        </Button>
                    </div>
                </div>
            </Card>

            <Card>
                {filtered.length ? (
                    <>
                        <TransactionList>
                            {filtered.slice(0, visible).map((t) => (
                                <TransactionRow key={t._id} transaction={t} onEdit={onEdit} onDelete={setPendingDelete} />
                            ))}
                        </TransactionList>
                        {filtered.length > visible && (
                            <div className="more">
                                <Button $variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                                    Show more ({filtered.length - visible} remaining)
                                </Button>
                            </div>
                        )}
                    </>
                ) : transactions.length ? (
                    <EmptyState
                        icon="filter-circle-xmark"
                        title="No matching transactions"
                        message="Try a different search or clear the filters."
                        action={<Button $variant="secondary" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear filters</Button>}
                    />
                ) : (
                    <EmptyState
                        title="No transactions yet"
                        message="Add your first income or expense to start tracking."
                        action={<Button onClick={() => onAdd('expense')}><Icon name="plus" /> Add expense</Button>}
                    />
                )}
            </Card>

            {pendingDelete && (
                <ConfirmDialog
                    title="Delete transaction?"
                    message={`“${pendingDelete.title}” (${fmt(pendingDelete.amount)}) will be permanently deleted.`}
                    onConfirm={() => deleteTransaction(pendingDelete)}
                    onClose={() => setPendingDelete(null)}
                />
            )}
        </Wrap>
    )
}

const Wrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .toolbar{
        display: grid;
        grid-template-columns: minmax(200px, 2fr) repeat(4, minmax(130px, 1fr));
        gap: .75rem;
        @media (max-width: 1100px){
            grid-template-columns: 1fr 1fr;
            .search{ grid-column: 1 / -1; }
        }
    }

    .search{
        position: relative;
        i{
            position: absolute;
            left: .75rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-subtle);
            font-size: .85rem;
        }
        input{
            padding-left: 2.25rem;
        }
    }

    .summary{
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: .75rem;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border);
        p{
            color: var(--text-muted);
            font-size: .875rem;
        }
        strong{
            color: var(--text);
            font-weight: 600;
        }
        .income{
            color: var(--income);
        }
        .dot{
            margin: 0 .5rem;
            color: var(--text-subtle);
        }
    }

    .summary-actions{
        display: flex;
        gap: .5rem;
    }

    .more{
        display: flex;
        justify-content: center;
        padding-top: 1.5rem;
    }
`;

export default Transactions
