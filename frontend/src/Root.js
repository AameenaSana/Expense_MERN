import React from 'react'
import { useAuth } from './context/authContext'
import { GlobalProvider } from './context/globalContext'
import App from './App'
import AuthPage from './Components/Auth/AuthPage'
import EmptyState from './Components/ui/EmptyState'

// Shows the login screen until there is a user, then the app.
function Root() {
  const {user, checking} = useAuth()

  if (checking) {
    return <EmptyState icon="spinner fa-spin" title="Loading…" />
  }
  if (!user) {
    return <AuthPage />
  }
  // Keyed by user so switching accounts starts with fresh state
  return (
    <GlobalProvider key={user._id}>
      <App />
    </GlobalProvider>
  )
}

export default Root
