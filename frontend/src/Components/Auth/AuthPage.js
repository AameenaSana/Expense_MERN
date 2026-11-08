import React, { useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../../context/authContext'
import { Button } from '../ui/Button'
import { Field, Input, FieldError, FieldHint } from '../ui/Field'
import Icon from '../ui/Icon'
import ThemeToggle from '../ui/ThemeToggle'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN = 8

const validate = (mode, {name, email, password}) => {
    const errors = {}
    if (mode === 'register' && !name.trim()) errors.name = 'Enter your name'
    if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address'
    if (mode === 'register' && password.length < PASSWORD_MIN) {
        errors.password = `Use at least ${PASSWORD_MIN} characters`
    } else if (!password) {
        errors.password = 'Enter your password'
    }
    return errors
}

function AuthPage() {
    const {login, register, notice} = useAuth()
    const [mode, setMode] = useState('login')
    const [values, setValues] = useState({name: '', email: '', password: ''})
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const isRegister = mode === 'register'

    const switchMode = (next) => {
        setMode(next)
        setErrors({})
        setServerError(null)
    }

    const onChange = (field) => (e) => {
        setValues((v) => ({...v, [field]: e.target.value}))
        if (errors[field]) setErrors((errs) => ({...errs, [field]: undefined}))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        const found = validate(mode, values)
        setErrors(found)
        setServerError(null)
        if (Object.keys(found).length) return

        setSubmitting(true)
        const email = values.email.trim()
        const result = isRegister
            ? await register(values.name.trim(), email, values.password)
            : await login(email, values.password)
        // On success this component unmounts, so only update state on failure
        if (!result.ok) {
            setServerError(result.error)
            setSubmitting(false)
        }
    }

    return (
        <Page>
            <div className="theme"><ThemeToggle /></div>
            <div className="panel">
                <div className="brand">
                    <span className="logo"><Icon name="wallet" /></span>
                    <span>Expense Tracker</span>
                </div>

                <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
                <p className="lead">
                    {isRegister ? 'Start tracking your income, spending and budgets.' : 'Log in to see your finances.'}
                </p>

                <div className="tabs" role="tablist" aria-label="Account">
                    <button role="tab" aria-selected={!isRegister} className={!isRegister ? 'active' : ''}
                        onClick={() => switchMode('login')}>Log in</button>
                    <button role="tab" aria-selected={isRegister} className={isRegister ? 'active' : ''}
                        onClick={() => switchMode('register')}>Sign up</button>
                </div>

                {(serverError || notice) && (
                    <div className="alert" role="alert">
                        <Icon name="circle-exclamation" />
                        <span>{serverError || notice}</span>
                    </div>
                )}

                <form onSubmit={onSubmit} noValidate>
                    {isRegister && (
                        <Field>
                            Name
                            <Input value={values.name} onChange={onChange('name')} autoComplete="name"
                                maxLength={50} aria-invalid={Boolean(errors.name)} autoFocus />
                            {errors.name && <FieldError>{errors.name}</FieldError>}
                        </Field>
                    )}
                    <Field>
                        Email
                        <Input type="email" value={values.email} onChange={onChange('email')} autoComplete="email"
                            aria-invalid={Boolean(errors.email)} autoFocus={!isRegister} />
                        {errors.email && <FieldError>{errors.email}</FieldError>}
                    </Field>
                    <Field>
                        Password
                        <div className="password">
                            <Input type={showPassword ? 'text' : 'password'} value={values.password}
                                onChange={onChange('password')} maxLength={72}
                                autoComplete={isRegister ? 'new-password' : 'current-password'}
                                aria-invalid={Boolean(errors.password)} />
                            <button type="button" className="reveal" onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                <Icon name={showPassword ? 'eye-slash' : 'eye'} />
                            </button>
                        </div>
                        {errors.password
                            ? <FieldError>{errors.password}</FieldError>
                            : isRegister && <FieldHint>At least {PASSWORD_MIN} characters</FieldHint>}
                    </Field>

                    <Button type="submit" disabled={submitting} className="submit">
                        {submitting && <Icon name="spinner" className="fa-spin" />}
                        {isRegister ? 'Create account' : 'Log in'}
                    </Button>
                </form>
            </div>
        </Page>
    )
}

const Page = styled.main`
    position: relative;
    display: grid;
    place-items: center;
    min-height: 100vh;
    padding: 2rem 1rem;

    .theme{
        position: absolute;
        top: 1rem;
        right: 1rem;
    }

    .panel{
        width: 100%;
        max-width: 400px;
        padding: 2rem;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
    }

    .brand{
        display: flex;
        align-items: center;
        gap: .75rem;
        margin-bottom: 1.75rem;
        font-weight: 700;
        .logo{
            display: grid;
            place-items: center;
            width: 36px;
            height: 36px;
            border-radius: 10px;
            background: var(--primary);
            color: #fff;
        }
    }

    h1{
        font-size: 1.4rem;
        font-weight: 700;
        letter-spacing: -.02em;
    }
    .lead{
        margin-top: .25rem;
        color: var(--text-muted);
        font-size: .9rem;
    }

    .tabs{
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: .25rem;
        margin: 1.5rem 0 1.25rem;
        padding: .25rem;
        border-radius: var(--radius-sm);
        background: var(--surface-2);
        button{
            height: 34px;
            border: none;
            border-radius: 6px;
            background: none;
            color: var(--text-muted);
            font-weight: 500;
            &.active{
                background: var(--surface);
                color: var(--text);
                box-shadow: var(--shadow);
            }
        }
    }

    .alert{
        display: flex;
        gap: .6rem;
        align-items: flex-start;
        margin-bottom: 1rem;
        padding: .7rem .85rem;
        border-radius: var(--radius-sm);
        background: var(--expense-soft);
        color: var(--expense-text);
        font-size: .85rem;
        i{
            margin-top: .15rem;
        }
    }

    form{
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .password{
        position: relative;
        input{
            padding-right: 2.75rem;
        }
        .reveal{
            position: absolute;
            top: 0;
            right: 0;
            width: 40px;
            height: 40px;
            border: none;
            background: none;
            color: var(--text-subtle);
            &:hover{
                color: var(--text);
            }
        }
    }

    .submit{
        width: 100%;
        margin-top: .5rem;
    }

    @media (max-width: 440px){
        .panel{
            padding: 1.5rem 1.25rem;
        }
    }
`;

export default AuthPage
