import React, { useState } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { categoriesFor } from '../../utils/categories'
import { toInputDate, todayInput } from '../../utils/format'
import Modal from '../ui/Modal'
import { Button } from '../ui/Button'
import { Field, FieldError, FieldHint, Input, Select, Textarea } from '../ui/Field'

const LIMITS = {title: 50, description: 200}

const emptyValues = () => ({title: '', amount: '', date: todayInput(), category: '', description: ''})

// Same rules as the server, so most mistakes are caught before sending
const validate = ({title, amount, date, category, description}) => {
    const errors = {}
    if (!title.trim()) errors.title = 'Enter a title'
    else if (title.trim().length > LIMITS.title) errors.title = `Keep it under ${LIMITS.title} characters`
    const n = Number(amount)
    if (amount === '' || !Number.isFinite(n) || n <= 0) errors.amount = 'Enter an amount greater than 0'
    if (!date || Number.isNaN(new Date(date).getTime())) errors.date = 'Choose a date'
    if (!category) errors.category = 'Choose a category'
    if (description.length > LIMITS.description) errors.description = `Keep it under ${LIMITS.description} characters`
    return errors
}

function TransactionForm({type: initialType, transaction, onClose}) {
    const {saveTransaction} = useGlobalContext()
    const editing = Boolean(transaction)
    const [type, setType] = useState(initialType)
    const [values, setValues] = useState(() => transaction ? {
        title: transaction.title,
        amount: String(transaction.amount),
        date: toInputDate(transaction.date),
        category: transaction.category,
        description: transaction.description || '',
    } : emptyValues())
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')
    const [saving, setSaving] = useState(false)

    const categories = categoriesFor(type)
    // Keep an unknown stored category selectable when editing older entries
    const hasUnknownCategory = values.category && !categories.some((c) => c.value === values.category)

    const update = (name) => (e) => {
        setValues((v) => ({...v, [name]: e.target.value}))
        setErrors((er) => ({...er, [name]: undefined}))
        setServerError('')
    }

    const switchType = (next) => {
        setType(next)
        // The category list differs per type, so clear an incompatible choice
        if (!categoriesFor(next).some((c) => c.value === values.category)) {
            setValues((v) => ({...v, category: ''}))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (saving) return
        const found = validate(values)
        setErrors(found)
        if (Object.keys(found).length) return

        setSaving(true)
        const result = await saveTransaction(type, {
            ...values,
            title: values.title.trim(),
            description: values.description.trim(),
            amount: Number(values.amount),
        }, transaction?._id)
        setSaving(false)

        if (result.ok) onClose()
        else setServerError(result.error)
    }

    const title = editing ? 'Edit transaction' : type === 'income' ? 'Add income' : 'Add expense'

    return (
        <Modal title={title} onClose={onClose}>
            <Form onSubmit={handleSubmit} noValidate>
                {!editing && (
                    <div className="type-toggle" role="radiogroup" aria-label="Transaction type">
                        {['expense', 'income'].map((t) => (
                            <button
                                key={t}
                                type="button"
                                role="radio"
                                aria-checked={type === t}
                                className={type === t ? `active ${t}` : ''}
                                onClick={() => switchType(t)}
                            >
                                {t === 'income' ? 'Income' : 'Expense'}
                            </button>
                        ))}
                    </div>
                )}

                {serverError && <div className="server-error" role="alert">{serverError}</div>}

                <Field>
                    Title
                    <Input
                        data-autofocus
                        value={values.title}
                        onChange={update('title')}
                        placeholder={type === 'income' ? 'e.g. Monthly salary' : 'e.g. Weekly groceries'}
                        maxLength={LIMITS.title}
                        aria-invalid={Boolean(errors.title)}
                    />
                    {errors.title && <FieldError>{errors.title}</FieldError>}
                </Field>

                <div className="row">
                    <Field>
                        Amount
                        <Input
                            type="number"
                            inputMode="decimal"
                            min="0.01"
                            step="0.01"
                            value={values.amount}
                            onChange={update('amount')}
                            placeholder="0.00"
                            aria-invalid={Boolean(errors.amount)}
                        />
                        {errors.amount && <FieldError>{errors.amount}</FieldError>}
                    </Field>
                    <Field>
                        Date
                        <Input
                            type="date"
                            value={values.date}
                            onChange={update('date')}
                            aria-invalid={Boolean(errors.date)}
                        />
                        {errors.date && <FieldError>{errors.date}</FieldError>}
                    </Field>
                </div>

                <Field>
                    Category
                    <Select value={values.category} onChange={update('category')} aria-invalid={Boolean(errors.category)}>
                        <option value="" disabled>Select a category</option>
                        {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        {hasUnknownCategory && <option value={values.category}>{values.category}</option>}
                    </Select>
                    {errors.category && <FieldError>{errors.category}</FieldError>}
                </Field>

                <Field>
                    <span className="label-row">
                        Note <FieldHint>Optional · {values.description.length}/{LIMITS.description}</FieldHint>
                    </span>
                    <Textarea
                        value={values.description}
                        onChange={update('description')}
                        placeholder="Add details or a reference"
                        maxLength={LIMITS.description}
                        rows={3}
                        aria-invalid={Boolean(errors.description)}
                    />
                    {errors.description && <FieldError>{errors.description}</FieldError>}
                </Field>

                <div className="actions">
                    <Button $variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Saving…' : editing ? 'Save changes' : title}
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .type-toggle{
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 4px;
        border-radius: var(--radius-sm);
        background: var(--surface-2);
        border: 1px solid var(--border);
        button{
            height: 34px;
            border: none;
            border-radius: 6px;
            background: none;
            color: var(--text-muted);
            font-weight: 500;
            transition: background .15s, color .15s;
            &.active{
                background: var(--surface);
                box-shadow: var(--shadow);
            }
            &.active.expense{ color: var(--expense); }
            &.active.income{ color: var(--income); }
        }
    }

    .server-error{
        padding: .75rem 1rem;
        border-radius: var(--radius-sm);
        background: var(--expense-soft);
        color: #991b1b;
        font-size: .875rem;
    }

    .row{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        @media (max-width: 480px){
            grid-template-columns: 1fr;
        }
    }

    .label-row{
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }

    .actions{
        display: flex;
        justify-content: flex-end;
        gap: .75rem;
        margin-top: .5rem;
    }
`;

export default TransactionForm
