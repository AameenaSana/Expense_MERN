import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { api, errorMessage } from '../utils/api'

const ENDPOINTS = {
    income: {list: 'get-incomes', add: 'add-income', update: 'update-income', remove: 'delete-income'},
    expense: {list: 'get-expenses', add: 'add-expense', update: 'update-expense', remove: 'delete-expense'},
}

const readCurrency = () => {
    try {
        return localStorage.getItem('currency') || 'USD'
    } catch {
        return 'USD'
    }
}

const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {
    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [budgets, setBudgets] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)
    const [currency, setCurrencyState] = useState(readCurrency)
    const [toasts, setToasts] = useState([])
    const toastId = useRef(0)

    //notifications
    const dismissToast = useCallback((id) => {
        setToasts((list) => list.filter((t) => t.id !== id))
    }, [])

    const notify = useCallback((message, kind = 'success') => {
        const id = ++toastId.current
        setToasts((list) => [...list.slice(-3), {id, message, kind}])
        setTimeout(() => dismissToast(id), 4000)
    }, [dismissToast])

    //settings
    const setCurrency = useCallback((code) => {
        setCurrencyState(code)
        try {
            localStorage.setItem('currency', code)
        } catch {
            // Storage unavailable (e.g. private mode); the choice lasts for this session
        }
    }, [])

    //loading
    const loadType = useCallback(async (type) => {
        const {data} = await api.get(ENDPOINTS[type].list)
        const list = data.map((item) => ({...item, type: item.type || type}))
        ;(type === 'income' ? setIncomes : setExpenses)(list)
    }, [])

    const loadBudgets = useCallback(async () => {
        const {data} = await api.get('budgets')
        setBudgets(data)
    }, [])

    const refresh = useCallback(async () => {
        setLoading(true)
        setLoadError(null)
        try {
            await Promise.all([loadType('income'), loadType('expense'), loadBudgets()])
        } catch (err) {
            setLoadError(errorMessage(err))
        } finally {
            setLoading(false)
        }
    }, [loadType, loadBudgets])

    useEffect(() => {
        refresh()
    }, [refresh])

    // Reload after a change. A failed reload is reported separately so the
    // user isn't told a successful save failed (and doesn't save it twice).
    const reloadAfterChange = useCallback(async (loader) => {
        try {
            await loader()
        } catch {
            notify('Saved, but the list could not be refreshed. Reload the page.', 'error')
        }
    }, [notify])

    //transactions
    const saveTransaction = useCallback(async (type, data, id) => {
        try {
            if (id) {
                await api.put(`${ENDPOINTS[type].update}/${id}`, data)
            } else {
                await api.post(ENDPOINTS[type].add, data)
            }
        } catch (err) {
            return {ok: false, error: errorMessage(err)}
        }
        await reloadAfterChange(() => loadType(type))
        notify(id ? 'Transaction updated' : `${type === 'income' ? 'Income' : 'Expense'} added`)
        return {ok: true}
    }, [loadType, notify, reloadAfterChange])

    const deleteTransaction = useCallback(async (transaction) => {
        const {type, _id} = transaction
        try {
            await api.delete(`${ENDPOINTS[type].remove}/${_id}`)
        } catch (err) {
            // Already gone on the server: treat as deleted
            if (err?.response?.status !== 404) {
                notify(errorMessage(err), 'error')
                return {ok: false}
            }
        }
        await reloadAfterChange(() => loadType(type))
        notify('Transaction deleted')
        return {ok: true}
    }, [loadType, notify, reloadAfterChange])

    //budgets
    const saveBudget = useCallback(async (category, amount) => {
        try {
            await api.put(`budgets/${encodeURIComponent(category)}`, {amount})
        } catch (err) {
            notify(errorMessage(err), 'error')
            return {ok: false}
        }
        await reloadAfterChange(loadBudgets)
        notify('Budget saved')
        return {ok: true}
    }, [loadBudgets, notify, reloadAfterChange])

    const deleteBudget = useCallback(async (category) => {
        try {
            await api.delete(`budgets/${encodeURIComponent(category)}`)
        } catch (err) {
            if (err?.response?.status !== 404) {
                notify(errorMessage(err), 'error')
                return {ok: false}
            }
        }
        await reloadAfterChange(loadBudgets)
        notify('Budget removed')
        return {ok: true}
    }, [loadBudgets, notify, reloadAfterChange])

    // All transactions, newest date first
    const transactions = useMemo(() => {
        return [...incomes, ...expenses].sort((a, b) =>
            new Date(b.date) - new Date(a.date) || new Date(b.createdAt) - new Date(a.createdAt)
        )
    }, [incomes, expenses])

    const value = useMemo(() => ({
        transactions,
        budgets,
        loading,
        loadError,
        refresh,
        saveTransaction,
        deleteTransaction,
        saveBudget,
        deleteBudget,
        currency,
        setCurrency,
        toasts,
        notify,
        dismissToast,
    }), [transactions, budgets, loading, loadError, refresh, saveTransaction, deleteTransaction,
        saveBudget, deleteBudget, currency, setCurrency, toasts, notify, dismissToast])

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}
