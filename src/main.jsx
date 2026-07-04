// ═══════════════════════════════════════════════════════════
// MAIN.JSX — mis à jour avec WelcomePage + AppLayout
// ═══════════════════════════════════════════════════════════
import React                          from 'react'
import ReactDOM                       from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth }      from './contexts/AuthContext'

import LandingPage  from './pages/LandingPage'
import AuthPage     from './pages/AuthPage'
import Dashboard    from './pages/Dashboard'
import WelcomePage  from './pages/WelcomePage'   // ← nouvelle page
import App          from './App'
import AppLayout    from './AppLayout'            // ← nouveau layout

import './index.css'

// ─── Loader global ────────────────────────────────────────
function GlobalLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a3e 40%, #0d1b4b 100%)' }}>
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Chargement...</p>
      </div>
    </div>
  )
}

// ─── Route protégée avec AppLayout (sidebar) ─────────────
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <GlobalLoader />
  if (!user)   return <Navigate to="/auth" replace />
  return (
    <AppLayout>
      {children}
    </AppLayout>
  )
}

// ─── Route publique (redirige si connecté) ────────────────
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <GlobalLoader />
  return user ? <Navigate to="/welcome" replace /> : children
}

// ─── Router ───────────────────────────────────────────────
function Router() {
  return (
    <Routes>
      {/* Publiques */}
      <Route path="/"    element={<LandingPage />} />
      <Route path="/auth" element={
        <PublicRoute><AuthPage /></PublicRoute>
      } />

      {/* Protégées — toutes dans AppLayout (sidebar) */}
      <Route path="/welcome" element={
        <ProtectedRoute><WelcomePage /></ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/generate" element={
        <ProtectedRoute><App /></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)