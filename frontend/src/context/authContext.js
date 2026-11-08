import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, errorMessage, readToken, setAuthToken, setUnauthorizedHandler } from '../utils/api'

const AuthContext = React.createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    // True while checking a saved token on startup
    const [checking, setChecking] = useState(() => Boolean(readToken()))
    // Shown on the login screen, e.g. after a session expires
    const [notice, setNotice] = useState(null)

    const logout = useCallback((message = null) => {
        setAuthToken(null)
        setUser(null)
        setNotice(message)
    }, [])

    useEffect(() => {
        setUnauthorizedHandler((message) => logout(message || 'Your session has expired. Please log in again'))
        return () => setUnauthorizedHandler(null)
    }, [logout])

    // Restore the session from a saved token
    useEffect(() => {
        if (!readToken()) return
        let cancelled = false
        api.get('auth/me')
            .then(({data}) => { if (!cancelled) setUser(data.user) })
            .catch((err) => {
                // A rejected token is handled by the 401 handler; anything else
                // (e.g. server down) just sends the user to the login screen
                if (!cancelled && err?.response?.status !== 401) {
                    setNotice(errorMessage(err))
                }
            })
            .finally(() => { if (!cancelled) setChecking(false) })
        return () => { cancelled = true }
    }, [])

    const authenticate = useCallback(async (path, body) => {
        try {
            const {data} = await api.post(path, body)
            setAuthToken(data.token)
            setUser(data.user)
            setNotice(null)
            return {ok: true}
        } catch (err) {
            return {ok: false, error: errorMessage(err)}
        }
    }, [])

    const login = useCallback((email, password) => authenticate('auth/login', {email, password}), [authenticate])
    const register = useCallback((name, email, password) => authenticate('auth/register', {name, email, password}), [authenticate])

    const value = useMemo(() => ({user, checking, notice, login, register, logout}),
        [user, checking, notice, login, register, logout])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
