import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Theme is "light" or "dark". Until the user picks one, it follows the
// system setting (and updates live if that changes). An explicit choice is
// saved in localStorage. public/index.html applies the saved theme before
// React loads so the page never flashes the wrong colours.

const STORAGE_KEY = 'theme'
const META_COLORS = {light: '#4f46e5', dark: '#0b0f1a'}

const systemQuery = () => window.matchMedia?.('(prefers-color-scheme: dark)')

const readSaved = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved === 'light' || saved === 'dark' ? saved : null
    } catch {
        return null
    }
}

const systemTheme = () => (systemQuery()?.matches ? 'dark' : 'light')

// Apply directly to the DOM (also used inside the view transition callback,
// where the change must happen synchronously)
export const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLORS[theme])
}

const ThemeContext = React.createContext({theme: 'light', setTheme: () => {}})

export const ThemeProvider = ({children}) => {
    const [saved, setSaved] = useState(readSaved)
    const [system, setSystem] = useState(systemTheme)
    const theme = saved || system

    // Follow system changes while the user hasn't chosen
    useEffect(() => {
        const query = systemQuery()
        if (!query) return
        const onChange = (e) => setSystem(e.matches ? 'dark' : 'light')
        query.addEventListener('change', onChange)
        return () => query.removeEventListener('change', onChange)
    }, [])

    useEffect(() => {
        applyTheme(theme)
    }, [theme])

    const setTheme = useCallback((next) => {
        applyTheme(next)
        setSaved(next)
        try {
            localStorage.setItem(STORAGE_KEY, next)
        } catch {
            // Storage unavailable; the choice lasts for this session
        }
    }, [])

    const value = useMemo(() => ({theme, setTheme}), [theme, setTheme])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
