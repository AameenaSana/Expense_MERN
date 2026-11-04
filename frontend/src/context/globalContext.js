import React, { useCallback, useContext, useState } from "react"
import axios from 'axios'


// Relative URL so it works both when the backend serves the build and in dev
// (via the "proxy" field in package.json). Override with REACT_APP_API_URL if needed.
const BASE_URL = process.env.REACT_APP_API_URL || "/api/v1/";


const GlobalContext = React.createContext()

const errorMessage = (err) =>
    err?.response?.data?.message || 'Unable to reach the server. Please try again.'

export const GlobalProvider = ({children}) => {

    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)

    //incomes
    const getIncomes = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`)
            setIncomes(response.data)
        } catch (err) {
            setError(errorMessage(err))
        }
    }, [])

    // Returns true on success so forms only reset when the item was saved
    const addIncome = async (income) => {
        try {
            await axios.post(`${BASE_URL}add-income`, income)
            setError(null)
            await getIncomes()
            return true
        } catch (err) {
            setError(errorMessage(err))
            return false
        }
    }

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`)
        } catch (err) {
            setError(errorMessage(err))
        }
        getIncomes()
    }

    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0)
    }


    //expenses
    const getExpenses = useCallback(async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`)
            setExpenses(response.data)
        } catch (err) {
            setError(errorMessage(err))
        }
    }, [])

    const addExpense = async (expense) => {
        try {
            await axios.post(`${BASE_URL}add-expense`, expense)
            setError(null)
            await getExpenses()
            return true
        } catch (err) {
            setError(errorMessage(err))
            return false
        }
    }

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`)
        } catch (err) {
            setError(errorMessage(err))
        }
        getExpenses()
    }

    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0)
    }


    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

        return history.slice(0, 3)
    }


    return (
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            expenses,
            totalIncome,
            addExpense,
            getExpenses,
            deleteExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () =>{
    return useContext(GlobalContext)
}
