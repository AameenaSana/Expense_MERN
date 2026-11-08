import axios from 'axios'

// Relative URL so it works both when the backend serves the build and in dev
// (via the "proxy" field in package.json). Override with REACT_APP_API_URL if needed.
const BASE_URL = process.env.REACT_APP_API_URL || "/api/v1/";

const TOKEN_KEY = 'authToken'

export const api = axios.create({baseURL: BASE_URL, timeout: 15000})

export const readToken = () => {
    try {
        return localStorage.getItem(TOKEN_KEY)
    } catch {
        return null
    }
}

export const storeToken = (token) => {
    try {
        if (token) localStorage.setItem(TOKEN_KEY, token)
        else localStorage.removeItem(TOKEN_KEY)
    } catch {
        // Storage unavailable (e.g. private mode); the session lasts until reload
    }
}

let currentToken = readToken()
let onUnauthorized = null

export const setAuthToken = (token) => {
    currentToken = token
    storeToken(token)
}

// Called when the server rejects our token (expired, or the account was removed)
export const setUnauthorizedHandler = (handler) => {
    onUnauthorized = handler
}

api.interceptors.request.use((config) => {
    if (currentToken) config.headers.Authorization = `Bearer ${currentToken}`
    return config
})

api.interceptors.response.use(undefined, (err) => {
    const isAuthRequest = /auth\/(login|register)/.test(err?.config?.url || '')
    if (err?.response?.status === 401 && !isAuthRequest && currentToken && onUnauthorized) {
        onUnauthorized(err.response.data?.message)
    }
    return Promise.reject(err)
})

export const errorMessage = (err) => {
    if (err?.response?.data?.message) return err.response.data.message
    if (err?.code === 'ECONNABORTED') return 'The server took too long to respond. Please try again.'
    return 'Unable to reach the server. Check that the backend is running.'
}
