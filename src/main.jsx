// ═══════════════════════════════════════════════════════════
// MAIN.JSX — avec système de crédits
// ═══════════════════════════════════════════════════════════
import React                          from 'react'
import ReactDOM                       from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth }      from './contexts/AuthContext'
import { useCredits }                 from './hooks/useCredits'

import LandingPage  from './pages/LandingPage'
import AuthPage     from './pages/AuthPage'
import Dashboard    from './pages/Dashboard'
import WelcomePage  from './pages/WelcomePage'
import PricingPage  from './pages/PricingPage'
import CheckoutPage from './pages/CheckoutPage'
import App          from './App'
import AppLayout    from './AppLayout'

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

// ─── Route protégée — vérifie l'authentification ─────────
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <GlobalLoader />
  if (!user)   return <Navigate to="/auth" replace />
  return <AppLayout>{children}</AppLayout>
}

// ─── Route publique — redirige si déjà connecté ──────────
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <GlobalLoader />
  return user ? <Navigate to="/welcome" replace /> : children
}

// ─── Credit Guard — bloque /generate si 0 crédits ────────
// Doit être à l'intérieur de ProtectedRoute (user garanti connecté).
// Pendant le chargement des crédits : affiche le GlobalLoader.
// Si 0 crédits : redirige vers /pricing avec un message explicatif.
// Sinon : laisse passer.
function CreditGuard({ children }) {
  const { credits, loading } = useCredits()

  // Toujours attendre que les crédits soient chargés avant de décider
  if (loading || credits === null) return <GlobalLoader />

  if (credits <= 0) {
    return <Navigate to="/pricing" replace state={{ reason: 'no_credits' }} />
  }

  return children
}

// ─── Router ───────────────────────────────────────────────
function Router() {
  return (
    <Routes>
      {/* ── Publiques ───────────────────────────────────── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={
        <PublicRoute><AuthPage /></PublicRoute>
      } />

      {/* ── Protégées (AppLayout + auth requise) ─────────── */}
      <Route path="/welcome" element={
        <ProtectedRoute><WelcomePage /></ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />

      {/* Génération — nécessite auth ET au moins 1 crédit */}
      <Route path="/generate" element={
        <ProtectedRoute>
          <CreditGuard>
            <App />
          </CreditGuard>
        </ProtectedRoute>
      } />

      {/* Tarifs — protégé pour afficher le solde de l'utilisateur */}
      <Route path="/pricing" element={
        <ProtectedRoute><PricingPage /></ProtectedRoute>
      } />

      {/* Checkout — protégé, reçoit le pack via location.state */}
      <Route path="/checkout" element={
        <ProtectedRoute><CheckoutPage /></ProtectedRoute>
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