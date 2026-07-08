// ═══════════════════════════════════════════════════════════
// useCredits.js — Hook de gestion des crédits utilisateur
// src/hooks/useCredits.js
// ═══════════════════════════════════════════════════════════
import { useState, useEffect, useCallback } from 'react'
import { doc, onSnapshot, updateDoc, increment, arrayUnion, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'

/**
 * Retourne :
 *  credits        — crédits disponibles (null = chargement)
 *  creditsUsed    — total consommé
 *  plan           — "free" | "starter" | "pro" | "business" | "enterprise"
 *  transactions   — historique des achats
 *  loading        — true pendant le premier chargement
 *  consumeCredit  — fn async : consomme 1 crédit, renvoie true si OK, false si insuffisant
 *  addCredits     — fn async (pack) : ajoute des crédits après achat
 */
export function useCredits() {
  const { user } = useAuth()
  const [credits, setCredits]           = useState(null)
  const [creditsUsed, setCreditsUsed]   = useState(0)
  const [plan, setPlan]                 = useState('free')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)

  // ── Écoute Firestore en temps réel ────────────────────────
  useEffect(() => {
    if (!user?.uid) { setLoading(false); return }

    const ref = doc(db, 'users', user.uid)
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        const d = snap.data()
        setCredits(d.credits       ?? 3)
        setCreditsUsed(d.creditsUsed  ?? 0)
        setPlan(d.plan             ?? 'free')
        setTransactions(d.transactions ?? [])
      } else {
        // Document n'existe pas encore (inscription très récente)
        setCredits(3)
        setCreditsUsed(0)
        setPlan('free')
        setTransactions([])
      }
      setLoading(false)
    }, () => setLoading(false))

    return unsub
  }, [user?.uid])

  // ── Consomme 1 crédit ──────────────────────────────────────
  const consumeCredit = useCallback(async () => {
    if (!user?.uid) return false
    if (credits !== null && credits <= 0) return false

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        credits:     increment(-1),
        creditsUsed: increment(1),
        updatedAt:   serverTimestamp(),
      })
      return true
    } catch (err) {
      console.error('❌ consumeCredit:', err)
      return false
    }
  }, [user?.uid, credits])

  // ── Ajoute des crédits après achat ────────────────────────
  const addCredits = useCallback(async (pack) => {
    if (!user?.uid) return false
    try {
      const transaction = {
        packId:      pack.id,
        packName:    pack.name,
        credits:     pack.credits,
        price:       pack.price,
        currency:    'EUR',
        purchasedAt: new Date().toISOString(),
        status:      'completed',
      }
      await updateDoc(doc(db, 'users', user.uid), {
        credits:      increment(pack.credits),
        plan:         pack.planId || 'starter',
        transactions: arrayUnion(transaction),
        updatedAt:    serverTimestamp(),
      })
      return true
    } catch (err) {
      console.error('❌ addCredits:', err)
      return false
    }
  }, [user?.uid])

  return { credits, creditsUsed, plan, transactions, loading, consumeCredit, addCredits }
}

// ── Packs disponibles ─────────────────────────────────────
export const CREDIT_PACKS = [
  {
    id:          'starter',
    planId:      'starter',
    name:        'Starter',
    credits:     5,
    price:       9.99,
    priceUnit:   2.00,
    currency:    'EUR',
    badge:       null,
    description: 'Idéal pour découvrir',
    features:    ['5 sites générés', 'Toutes les sections', 'Export HTML', 'Support email'],
    color:       '#6366f1',
    bgColor:     '#f5f3ff',
  },
  {
    id:          'pro',
    planId:      'pro',
    name:        'Pro',
    credits:     15,
    price:       24.99,
    priceUnit:   1.67,
    currency:    'EUR',
    badge:       '⭐ Populaire',
    description: 'Pour les professionnels',
    features:    ['15 sites générés', 'Toutes les sections', 'Export HTML', 'Logo IA inclus', 'Support prioritaire'],
    color:       '#7c3aed',
    bgColor:     '#faf5ff',
  },
  {
    id:          'business',
    planId:      'business',
    name:        'Business',
    credits:     40,
    price:       49.99,
    priceUnit:   1.25,
    currency:    'EUR',
    badge:       '🔥 Meilleur rapport',
    description: 'Pour les agences',
    features:    ['40 sites générés', 'Toutes les sections', 'Export HTML', 'Logo IA inclus', 'Section switcher', 'Support dédié'],
    color:       '#0891b2',
    bgColor:     '#f0f9ff',
  },
  {
    id:          'enterprise',
    planId:      'enterprise',
    name:        'Entreprise',
    credits:     100,
    price:       99.99,
    priceUnit:   1.00,
    currency:    'EUR',
    badge:       '💎 Meilleur prix',
    description: 'Volume & équipes',
    features:    ['100 sites générés', 'Toutes les sections', 'Export HTML', 'Logo IA inclus', 'Section switcher', 'API access', 'Support 24/7'],
    color:       '#059669',
    bgColor:     '#f0fdf4',
  },
]